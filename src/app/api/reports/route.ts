import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get('community_id');
    const category = searchParams.get('category');

    let sql = `
      SELECT 
        cr.id, cr.community_id, c.name as community_name, cr.reporter_name,
        cr.phone, cr.category, cr.description, cr.urgency, cr.latitude, cr.longitude,
        cr.status, cr.reported_at
      FROM citizen_reports cr
      JOIN communities c ON c.id = cr.community_id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (communityId) {
      params.push(communityId);
      conditions.push(`cr.community_id = $${params.length}`);
    }

    if (category) {
      params.push(category);
      conditions.push(`cr.category = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY cr.reported_at DESC LIMIT 50;';

    const reports = await query(sql, params);
    return NextResponse.json({ success: true, reports });
  } catch (error: any) {
    console.error('GET /api/reports Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch reports.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      communityId,
      reporterName = 'Community Resident',
      phone = 'Anonymous',
      category,
      description,
      urgency = 'MEDIUM',
      latitude,
      longitude,
    } = body;

    if (!communityId || !category || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: communityId, category, and description are required.' },
        { status: 400 }
      );
    }

    // Default to community coordinates if citizen GPS is unavailable
    let lat = latitude;
    let lng = longitude;

    if (!lat || !lng) {
      const comm = await query('SELECT latitude, longitude FROM communities WHERE id = $1', [communityId]);
      if (comm.length > 0) {
        lat = comm[0].latitude + (Math.random() * 0.002 - 0.001);
        lng = comm[0].longitude + (Math.random() * 0.002 - 0.001);
      } else {
        lat = 8.8782;
        lng = 7.0142;
      }
    }

    const reportId = `rep-${Date.now()}`;

    await query(`
      INSERT INTO citizen_reports (id, community_id, reporter_name, phone, category, description, urgency, latitude, longitude, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING');
    `, [reportId, communityId, reporterName, phone, category, description, urgency, lat, lng]);

    // If urgency is HIGH or CRITICAL, slightly adjust community health index
    if (urgency === 'HIGH' || urgency === 'CRITICAL') {
      await query(`
        UPDATE communities 
        SET health_index = GREATEST(30, health_index - 5)
        WHERE id = $1;
      `, [communityId]);
    }

    return NextResponse.json({
      success: true,
      message: 'Citizen report successfully submitted and integrated into Digital Twin state.',
      reportId,
    });
  } catch (error: any) {
    console.error('POST /api/reports Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit citizen report.' },
      { status: 500 }
    );
  }
}
