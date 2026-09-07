import { NextResponse } from "next/server";
import { Client } from "pg";

async function getClient(): Promise<Client | null> {
  const connString = process.env.DATABASE_URL;
  if (!connString) return null;
  const client = new Client({
    connectionString: connString,
    connectionTimeoutMillis: 5000,
  });
  await client.connect();
  return client;
}

export async function GET() {
  let client: Client | null = null;
  try {
    client = await getClient();
    if (!client) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const res = await client.query(`
      SELECT 
        wp.id, 
        wp.community_id, 
        wp.name, 
        wp.type, 
        wp.status, 
        wp.flow_rate_lpm, 
        wp.water_quality_score, 
        wp.ph, 
        wp.turbidity_ntu, 
        wp.tds_ppm, 
        wp.energy_kwh, 
        wp.latitude, 
        wp.longitude, 
        wp.updated_at,
        c.name as community_name
      FROM water_points wp
      LEFT JOIN communities c ON wp.community_id = c.id
      ORDER BY wp.name ASC
    `);

    const recentReadings = await client.query(`
      SELECT * FROM sensor_readings 
      ORDER BY recorded_at DESC 
      LIMIT 15
    `);

    await client.end();

    return NextResponse.json({
      success: true,
      waterPoints: res.rows,
      recentReadings: recentReadings.rows,
    });
  } catch (error: any) {
    if (client) {
      try {
        await client.end();
      } catch (_) {}
    }
    return NextResponse.json(
      { error: error?.message || "Failed to fetch water points" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let client: Client | null = null;
  try {
    const body = await request.json();
    const {
      username,
      password,
      waterPointId,
      flowRateLpm,
      waterQualityScore,
      ph,
      turbidityNtu,
      tdsPpm,
      energyKwh,
      status,
      vibrationMmS,
    } = body;

    // Authentication check for admin credentials
    if (username !== "admin" || password !== "admin") {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    if (!waterPointId) {
      return NextResponse.json(
        { error: "Missing waterPointId" },
        { status: 400 }
      );
    }

    client = await getClient();
    if (!client) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // 1. Update the water_points record
    const updateRes = await client.query(
      `UPDATE water_points 
       SET 
         flow_rate_lpm = $1,
         water_quality_score = $2,
         ph = $3,
         turbidity_ntu = $4,
         tds_ppm = $5,
         energy_kwh = $6,
         status = $7,
         updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        Number(flowRateLpm) || 0,
        Number(waterQualityScore) || 0,
        Number(ph) || 7.0,
        Number(turbidityNtu) || 0,
        Number(tdsPpm) || 0,
        Number(energyKwh) || 0,
        status || "OPERATIONAL",
        waterPointId,
      ]
    );

    // 2. Insert into sensor_readings for audit history
    await client.query(
      `INSERT INTO sensor_readings 
       (water_point_id, flow_rate_lpm, water_quality_score, ph, turbidity_ntu, tds_ppm, energy_kwh, pump_status, recorded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        waterPointId,
        Number(flowRateLpm) || 0,
        Number(waterQualityScore) || 0,
        Number(ph) || 7.0,
        Number(turbidityNtu) || 0,
        Number(tdsPpm) || 0,
        Number(energyKwh) || 0,
        status || "OPERATIONAL",
      ]
    );

    await client.end();

    return NextResponse.json({
      success: true,
      message: `Telemetry transmitted successfully for ${waterPointId}. Status set to ${status}.`,
      updatedWaterPoint: updateRes.rows[0],
      vibrationMmS: vibrationMmS || 0,
    });
  } catch (error: any) {
    if (client) {
      try {
        await client.end();
      } catch (_) {}
    }
    return NextResponse.json(
      { error: error?.message || "Failed to update sensor telemetry" },
      { status: 500 }
    );
  }
}
