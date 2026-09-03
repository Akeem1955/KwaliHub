import { NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure DB tables exist
    await initDb();

    // 1. Fetch Communities with water points
    const communities = await query(`
      SELECT 
        c.id, c.name, c.lga, c.latitude, c.longitude, c.population, c.baseline_source, c.health_index,
        wp.id as water_point_id, wp.name as water_point_name, wp.type as water_point_type,
        wp.status as water_point_status, wp.flow_rate_lpm, wp.water_quality_score,
        wp.ph, wp.turbidity_ntu, wp.tds_ppm, wp.energy_kwh, wp.updated_at
      FROM communities c
      LEFT JOIN water_points wp ON wp.community_id = c.id
      ORDER BY c.name ASC;
    `);

    // 2. Fetch Recent Citizen Reports
    const recentReports = await query(`
      SELECT 
        cr.id, cr.community_id, c.name as community_name, cr.reporter_name,
        cr.category, cr.description, cr.urgency, cr.latitude, cr.longitude,
        cr.status, cr.reported_at
      FROM citizen_reports cr
      JOIN communities c ON c.id = cr.community_id
      ORDER BY cr.reported_at DESC
      LIMIT 20;
    `);

    // 3. Fetch Active AI Interventions
    const activeInterventions = await query(`
      SELECT 
        ai.id, ai.community_id, c.name as community_name, ai.title,
        ai.diagnosis, ai.proposed_actions, ai.estimated_cost_ngn,
        ai.priority, ai.status, ai.created_at
      FROM ai_interventions ai
      JOIN communities c ON c.id = ai.community_id
      ORDER BY ai.created_at DESC
      LIMIT 10;
    `);

    // 4. Calculate Aggregate System Stats
    const totalCommunities = communities.length;
    const operationalCount = communities.filter(c => c.water_point_status === 'OPERATIONAL').length;
    const degradedCount = communities.filter(c => c.water_point_status === 'DEGRADED').length;
    const criticalCount = communities.filter(c => c.water_point_status === 'CRITICAL' || c.water_point_status === 'OFFLINE').length;
    const totalPopulation = communities.reduce((acc, c) => acc + (c.population || 0), 0);
    const avgHealthIndex = totalCommunities > 0
      ? Math.round(communities.reduce((acc, c) => acc + (c.health_index || 0), 0) / totalCommunities)
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalCommunities,
        operationalCount,
        degradedCount,
        criticalCount,
        totalPopulation,
        avgHealthIndex,
        totalReports: recentReports.length,
        totalInterventions: activeInterventions.length,
      },
      communities,
      recentReports,
      activeInterventions,
    });
  } catch (error: any) {
    console.error('API twin/overview Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch digital twin overview.' },
      { status: 500 }
    );
  }
}
