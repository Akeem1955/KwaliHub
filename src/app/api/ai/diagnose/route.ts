import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateWASHIntervention } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { communityId } = body;

    if (!communityId) {
      return NextResponse.json(
        { success: false, error: 'communityId is required.' },
        { status: 400 }
      );
    }

    // 1. Fetch community & water point
    const points = await query(`
      SELECT 
        c.name as community_name, wp.id as water_point_id, wp.status,
        wp.flow_rate_lpm, wp.water_quality_score, wp.ph, wp.turbidity_ntu, wp.tds_ppm
      FROM communities c
      JOIN water_points wp ON wp.community_id = c.id
      WHERE c.id = $1;
    `, [communityId]);

    if (points.length === 0) {
      return NextResponse.json(
        { success: false, error: `Community ${communityId} or associated water point not found.` },
        { status: 404 }
      );
    }

    const point = points[0];

    // 2. Fetch recent citizen reports for this community
    const reports = await query<{ category: string; description: string; urgency: string }>(`
      SELECT category, description, urgency
      FROM citizen_reports
      WHERE community_id = $1
      ORDER BY reported_at DESC
      LIMIT 5;
    `, [communityId]);

    // 3. Synthesize via Gemini Flash
    const intervention = await generateWASHIntervention(
      point.community_name,
      {
        status: point.status,
        flowRate: point.flow_rate_lpm,
        waterQualityScore: point.water_quality_score,
        ph: point.ph,
        turbidity: point.turbidity_ntu,
        tds: point.tds_ppm,
      },
      reports
    );

    // 4. Save to PostgreSQL
    const interventionId = `int-${communityId}-${Date.now()}`;

    await query(`
      INSERT INTO ai_interventions (id, community_id, title, diagnosis, proposed_actions, estimated_cost_ngn, priority, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'PROPOSED');
    `, [
      interventionId,
      communityId,
      intervention.title,
      intervention.diagnosis,
      JSON.stringify(intervention.proposedActions),
      intervention.estimatedCostNgn,
      intervention.priority
    ]);

    return NextResponse.json({
      success: true,
      intervention: {
        id: interventionId,
        communityId,
        communityName: point.community_name,
        ...intervention,
        status: 'PROPOSED',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('POST /api/ai/diagnose Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to synthesize AI intervention.' },
      { status: 500 }
    );
  }
}
