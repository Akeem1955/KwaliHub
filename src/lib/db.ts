import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment.');
    }
    pool = new Pool({
      connectionString,
      ssl: false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const p = getDbPool();
  const res = await p.query(text, params);
  return res.rows as T[];
}

export async function initDb(): Promise<void> {
  const p = getDbPool();
  const client = await p.connect();

  try {
    // Attempt pgvector extension creation
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    } catch (e: any) {
      console.warn('pgvector extension warning (might already exist or require superuser):', e.message);
    }

    // Communities Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS communities (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL UNIQUE,
        lga VARCHAR(64) DEFAULT 'Kwali',
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        population INTEGER DEFAULT 2500,
        baseline_source VARCHAR(128) DEFAULT 'Unprotected Well / Stream',
        health_index INTEGER DEFAULT 72,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Water Points Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS water_points (
        id VARCHAR(64) PRIMARY KEY,
        community_id VARCHAR(64) REFERENCES communities(id) ON DELETE CASCADE,
        name VARCHAR(128) NOT NULL,
        type VARCHAR(64) DEFAULT 'Solar Motorized Borehole',
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        status VARCHAR(32) DEFAULT 'OPERATIONAL', -- OPERATIONAL, DEGRADED, CRITICAL, OFFLINE
        flow_rate_lpm DOUBLE PRECISION DEFAULT 18.5,
        water_quality_score DOUBLE PRECISION DEFAULT 88.0, -- 0-100 score
        ph DOUBLE PRECISION DEFAULT 7.2,
        turbidity_ntu DOUBLE PRECISION DEFAULT 2.1,
        tds_ppm DOUBLE PRECISION DEFAULT 145.0,
        energy_kwh DOUBLE PRECISION DEFAULT 1.2,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Sensor Readings Time Series
    await client.query(`
      CREATE TABLE IF NOT EXISTS sensor_readings (
        id BIGSERIAL PRIMARY KEY,
        water_point_id VARCHAR(64) REFERENCES water_points(id) ON DELETE CASCADE,
        flow_rate_lpm DOUBLE PRECISION NOT NULL,
        water_quality_score DOUBLE PRECISION NOT NULL,
        ph DOUBLE PRECISION NOT NULL,
        turbidity_ntu DOUBLE PRECISION NOT NULL,
        tds_ppm DOUBLE PRECISION NOT NULL,
        energy_kwh DOUBLE PRECISION NOT NULL,
        pump_status VARCHAR(32) NOT NULL,
        recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_sensor_readings_point_time ON sensor_readings(water_point_id, recorded_at DESC);
    `);

    // Citizen Reports Crowdsourcing Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS citizen_reports (
        id VARCHAR(64) PRIMARY KEY,
        community_id VARCHAR(64) REFERENCES communities(id) ON DELETE CASCADE,
        reporter_name VARCHAR(128) DEFAULT 'Community Resident',
        phone VARCHAR(32) DEFAULT 'Anonymous',
        category VARCHAR(64) NOT NULL, -- NO_WATER, DIRTY_WATER, PUMP_LEAK, SANITATION_HAZARD, LOW_PRESSURE
        description TEXT NOT NULL,
        urgency VARCHAR(32) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, EMERGENCY
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        status VARCHAR(32) DEFAULT 'PENDING', -- PENDING, INVESTIGATING, VERIFIED, RESOLVED
        reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_citizen_reports_community ON citizen_reports(community_id, reported_at DESC);
    `);

    // WASH Vector Knowledge Memory Table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS wash_knowledge (
          id VARCHAR(64) PRIMARY KEY,
          category VARCHAR(64) NOT NULL,
          title VARCHAR(256) NOT NULL,
          content TEXT NOT NULL,
          embedding vector(768),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (e: any) {
      // Fallback if vector type is not enabled
      await client.query(`
        CREATE TABLE IF NOT EXISTS wash_knowledge (
          id VARCHAR(64) PRIMARY KEY,
          category VARCHAR(64) NOT NULL,
          title VARCHAR(256) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    }

    // AI Interventions Table (Gemini Flash synthesized strategies)
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_interventions (
        id VARCHAR(64) PRIMARY KEY,
        community_id VARCHAR(64) REFERENCES communities(id) ON DELETE CASCADE,
        title VARCHAR(256) NOT NULL,
        diagnosis TEXT NOT NULL,
        proposed_actions JSONB NOT NULL,
        estimated_cost_ngn INTEGER NOT NULL,
        priority VARCHAR(32) DEFAULT 'HIGH', -- LOW, MEDIUM, HIGH, CRITICAL
        status VARCHAR(32) DEFAULT 'PROPOSED', -- PROPOSED, SIMULATED, APPROVED, IN_PROGRESS, COMPLETED
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Digital Twin Pre-Implementation Simulation Runs
    await client.query(`
      CREATE TABLE IF NOT EXISTS simulation_runs (
        id VARCHAR(64) PRIMARY KEY,
        intervention_id VARCHAR(64) REFERENCES ai_interventions(id) ON DELETE CASCADE,
        community_id VARCHAR(64) REFERENCES communities(id) ON DELETE CASCADE,
        scenario_days INTEGER DEFAULT 30,
        baseline_uptime_pct DOUBLE PRECISION NOT NULL,
        projected_uptime_pct DOUBLE PRECISION NOT NULL,
        projected_cost_ngn INTEGER NOT NULL,
        projected_water_yield_liters INTEGER NOT NULL,
        avoided_downtime_hours INTEGER NOT NULL,
        health_risk_reduction_pct DOUBLE PRECISION NOT NULL,
        trajectory JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('PostgreSQL database initialized successfully with all Digital Twin schemas.');
  } finally {
    client.release();
  }
}
