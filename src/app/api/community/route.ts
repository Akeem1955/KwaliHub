import { NextResponse } from "next/server";
import { Client } from "pg";

async function getDbClient() {
  const connString = process.env.DATABASE_URL;
  if (!connString) return null;
  const client = new Client({
    connectionString: connString,
    connectionTimeoutMillis: 5000,
  });
  await client.connect();
  return client;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ward = searchParams.get("ward") || "kilankwa";

  let client: Client | null = null;
  try {
    client = await getDbClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      );
    }

    const commRes = await client.query(
      "SELECT id, name, lga, latitude, longitude, population, baseline_source, health_index FROM communities ORDER BY name ASC;"
    );

    const wpQuery = ward === "all"
      ? "SELECT id, community_id, name, type, status, flow_rate_lpm, water_quality_score, ph, turbidity_ntu, tds_ppm, energy_kwh, latitude, longitude, updated_at FROM water_points ORDER BY name ASC;"
      : "SELECT id, community_id, name, type, status, flow_rate_lpm, water_quality_score, ph, turbidity_ntu, tds_ppm, energy_kwh, latitude, longitude, updated_at FROM water_points WHERE community_id = $1;";
    const wpParams = ward === "all" ? [] : [ward];
    const wpRes = await client.query(wpQuery, wpParams);

    const repQuery = ward === "all"
      ? "SELECT id, community_id, reporter_name, phone, category, description, urgency, latitude, longitude, status, reported_at FROM citizen_reports ORDER BY reported_at DESC LIMIT 30;"
      : "SELECT id, community_id, reporter_name, phone, category, description, urgency, latitude, longitude, status, reported_at FROM citizen_reports WHERE community_id = $1 ORDER BY reported_at DESC LIMIT 30;";
    const repParams = ward === "all" ? [] : [ward];
    const repRes = await client.query(repQuery, repParams);

    await client.end();

    const currentComm = commRes.rows.find((c: any) => c.id === ward) || commRes.rows[0] || null;

    return NextResponse.json({
      success: true,
      source: "database",
      community: currentComm,
      allCommunities: commRes.rows,
      waterPoints: wpRes.rows,
      reports: repRes.rows,
    });
  } catch (err: any) {
    if (client) {
      try {
        await client.end();
      } catch (_) {}
    }
    return NextResponse.json(
      { success: false, error: err.message || "Database query failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let client: Client | null = null;
  try {
    const body = await request.json();
    const communityId = body.communityId || body.community_id;
    const reporterName = body.reporterName || body.reporter_name || "Community Scout";
    const phone = body.phone || "Verified Scout";
    const { category, description, urgency, latitude, longitude } = body;

    if (!communityId || !category || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required report fields" },
        { status: 400 }
      );
    }

    client = await getDbClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      );
    }

    const reportId = `rep-${Date.now()}`;
    const insertRes = await client.query(
      `INSERT INTO citizen_reports 
       (id, community_id, reporter_name, phone, category, description, urgency, latitude, longitude, status, reported_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', NOW())
       RETURNING *;`,
      [
        reportId,
        communityId,
        reporterName || "Anonymous Scout",
        phone || "N/A",
        category,
        description,
        urgency || "MEDIUM",
        latitude || 8.82,
        longitude || 6.98,
      ]
    );

    await client.end();

    return NextResponse.json({
      success: true,
      message: "Scout report submitted and persisted to Kwali database.",
      report: insertRes.rows[0],
    });
  } catch (error: any) {
    if (client) {
      try {
        await client.end();
      } catch (_) {}
    }
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit scout report" },
      { status: 500 }
    );
  }
}
