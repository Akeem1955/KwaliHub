import { query, initDb } from './db';

export const KWALI_COMMUNITIES = [
  {
    id: 'kwali-central',
    name: 'Kwali Central',
    latitude: 8.8782,
    longitude: 7.0142,
    population: 14500,
    baseline_source: 'Motorized Borehole & Piped Kiosk',
    health_index: 85,
  },
  {
    id: 'bako',
    name: 'Bako',
    latitude: 8.8450,
    longitude: 7.0280,
    population: 3200,
    baseline_source: 'Solar Borehole',
    health_index: 48, // degraded anomaly
  },
  {
    id: 'kilankwa',
    name: 'Kilankwa',
    latitude: 8.8210,
    longitude: 6.9850,
    population: 2800,
    baseline_source: 'Handpump & Seasonal Stream',
    health_index: 68,
  },
  {
    id: 'dafa',
    name: 'Dafa',
    latitude: 8.9120,
    longitude: 7.0510,
    population: 3100,
    baseline_source: 'Solar Submersible Pump',
    health_index: 78,
  },
  {
    id: 'pai',
    name: 'Pai',
    latitude: 8.7900,
    longitude: 7.0800,
    population: 4100,
    baseline_source: 'Deep Borehole',
    health_index: 81,
  },
  {
    id: 'gumbo',
    name: 'Gumbo',
    latitude: 8.8650,
    longitude: 6.9420,
    population: 1900,
    baseline_source: 'Community Well & Handpump',
    health_index: 74,
  },
  {
    id: 'sheda',
    name: 'Sheda',
    latitude: 8.8710,
    longitude: 7.0850,
    population: 5800,
    baseline_source: 'Solar Powered Filtration Kiosk',
    health_index: 52, // turbidity anomaly
  },
  {
    id: 'yangoji',
    name: 'Yangoji',
    latitude: 8.7450,
    longitude: 6.9120,
    population: 6200,
    baseline_source: 'Motorized Water Scheme',
    health_index: 80,
  },
  {
    id: 'yebu',
    name: 'Yebu',
    latitude: 8.7120,
    longitude: 7.1150,
    population: 2600,
    baseline_source: 'Borehole & Rain Catchment',
    health_index: 70,
  },
  {
    id: 'koroko',
    name: 'Koroko',
    latitude: 8.9350,
    longitude: 6.9920,
    population: 2200,
    baseline_source: 'Handpump',
    health_index: 76,
  },
];

export const INITIAL_CITIZEN_REPORTS = [
  {
    id: 'rep-001',
    community_id: 'bako',
    reporter_name: 'Amina Idris',
    phone: '+2348034567891',
    category: 'LOW_PRESSURE',
    description: 'The solar pump tap in Bako takes 10 minutes to fill one 25L jerrycan. Weak pressure since Tuesday.',
    urgency: 'HIGH',
    latitude: 8.8452,
    longitude: 7.0278,
    status: 'VERIFIED',
  },
  {
    id: 'rep-002',
    community_id: 'bako',
    reporter_name: 'Musa Garba',
    phone: '+2348029876543',
    category: 'PUMP_LEAK',
    description: 'Water is gushing out from the underground riser joint near the primary school distribution point.',
    urgency: 'HIGH',
    latitude: 8.8460,
    longitude: 7.0290,
    status: 'INVESTIGATING',
  },
  {
    id: 'rep-003',
    community_id: 'sheda',
    reporter_name: 'Grace Yakubu',
    phone: '+2348141234567',
    category: 'DIRTY_WATER',
    description: 'Tap water is visibly cloudy with reddish clay sediments after yesterday evening rain.',
    urgency: 'CRITICAL',
    latitude: 8.8715,
    longitude: 7.0855,
    status: 'INVESTIGATING',
  },
  {
    id: 'rep-004',
    community_id: 'kilankwa',
    reporter_name: 'Ibrahim Danladi',
    phone: '+2347055551212',
    category: 'SANITATION_HAZARD',
    description: 'Open drainage overflow near the public water collection apron. Risk of runoff contamination.',
    urgency: 'MEDIUM',
    latitude: 8.8214,
    longitude: 6.9852,
    status: 'PENDING',
  },
  {
    id: 'rep-005',
    community_id: 'kwali-central',
    reporter_name: 'Sunday Okafor',
    phone: '+2348099887766',
    category: 'NO_WATER',
    description: 'Main dispensary tap was dry between 8am and 11am today due to solar inverter trip.',
    urgency: 'MEDIUM',
    latitude: 8.8785,
    longitude: 7.0140,
    status: 'RESOLVED',
  }
];

export const WASH_KNOWLEDGE_BASE = [
  {
    id: 'kb-01',
    category: 'PUMP_FAILURE',
    title: 'Solar Submersible Pump Flow Degradation Troubleshooting',
    content: 'When flow rate drops by >30% while solar irradiance is optimal (>650W/m2), inspect for: 1) Sand accumulation in impeller, 2) Loose discharge pipe coupling / riser pipe perforation, 3) Dropping static water table causing pump drawdown cavitation.'
  },
  {
    id: 'kb-02',
    category: 'WATER_QUALITY',
    title: 'Post-Precipitation Turbidity & Clay Intrusion Remediation',
    content: 'Turbidity exceeding 5 NTU indicates surface water infiltration or damaged casing screen. Immediate protocol: Shock chlorination at 50mg/L free chlorine residual for 12 hours, followed by multi-media sand backwashing and membrane inspection.'
  },
  {
    id: 'kb-03',
    category: 'COMMUNITY_FINANCING',
    title: 'Micro-Enterprise Maintenance Cost Recovery Model',
    content: 'For a 20m3/day rural solar borehole, a volumetric user fee of ₦20 per 25L jerrycan creates a monthly revenue of ₦48,000, reserving 35% (₦16,800/mo) in a local escrow account for replacement inverter batteries, chlorination tablets, and technician retainers.'
  },
  {
    id: 'kb-04',
    category: 'SANITATION_PROTECTION',
    title: 'Wellhead Sanitary Buffer Zone Protocol',
    content: 'All pit latrines, soakaway pits, and animal troughs must maintain a minimum 30-meter radial clearance from the water point wellhead to prevent microbial pathogen migration through permeable lateritic soil.'
  }
];

export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  await initDb();

  // 1. Seed Communities
  for (const c of KWALI_COMMUNITIES) {
    await query(`
      INSERT INTO communities (id, name, lga, latitude, longitude, population, baseline_source, health_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        population = EXCLUDED.population,
        health_index = EXCLUDED.health_index;
    `, [c.id, c.name, 'Kwali', c.latitude, c.longitude, c.population, c.baseline_source, c.health_index]);

    // 2. Seed Primary Water Point for each community
    const isBako = c.id === 'bako';
    const isSheda = c.id === 'sheda';
    const status = isBako ? 'DEGRADED' : isSheda ? 'DEGRADED' : 'OPERATIONAL';
    const flowRate = isBako ? 6.2 : 19.5; // low flow in Bako
    const qualityScore = isSheda ? 58.0 : 92.0; // poor quality in Sheda
    const ph = isSheda ? 6.4 : 7.3;
    const turbidity = isSheda ? 8.4 : 1.8; // high turbidity in Sheda
    const tds = isSheda ? 280.0 : 140.0;

    await query(`
      INSERT INTO water_points (id, community_id, name, type, latitude, longitude, status, flow_rate_lpm, water_quality_score, ph, turbidity_ntu, tds_ppm)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        flow_rate_lpm = EXCLUDED.flow_rate_lpm,
        water_quality_score = EXCLUDED.water_quality_score,
        ph = EXCLUDED.ph,
        turbidity_ntu = EXCLUDED.turbidity_ntu,
        tds_ppm = EXCLUDED.tds_ppm,
        updated_at = CURRENT_TIMESTAMP;
    `, [
      `wp-${c.id}`,
      c.id,
      `${c.name} Community Water Scheme`,
      'Solar Motorized Borehole',
      c.latitude + 0.001,
      c.longitude + 0.001,
      status,
      flowRate,
      qualityScore,
      ph,
      turbidity,
      tds
    ]);

    // 3. Seed 7 historical readings for telemetry tracking
    for (let day = 6; day >= 0; day--) {
      const recordedAt = new Date(Date.now() - day * 86400000);
      const dayFlow = isBako ? Math.max(4.0, flowRate - (6 - day) * 0.8) : flowRate + (Math.random() * 2 - 1);
      const dayTurbidity = isSheda ? turbidity + (Math.random() * 1.5 - 0.5) : turbidity;
      const dayScore = isSheda ? 55 + Math.random() * 5 : 90 + Math.random() * 5;

      await query(`
        INSERT INTO sensor_readings (water_point_id, flow_rate_lpm, water_quality_score, ph, turbidity_ntu, tds_ppm, energy_kwh, pump_status, recorded_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `, [
        `wp-${c.id}`,
        parseFloat(dayFlow.toFixed(1)),
        parseFloat(dayScore.toFixed(1)),
        parseFloat(ph.toFixed(2)),
        parseFloat(dayTurbidity.toFixed(1)),
        tds,
        parseFloat((1.1 + Math.random() * 0.3).toFixed(2)),
        status,
        recordedAt
      ]);
    }
  }

  // 4. Seed Citizen Reports
  for (const r of INITIAL_CITIZEN_REPORTS) {
    await query(`
      INSERT INTO citizen_reports (id, community_id, reporter_name, phone, category, description, urgency, latitude, longitude, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO NOTHING;
    `, [r.id, r.community_id, r.reporter_name, r.phone, r.category, r.description, r.urgency, r.latitude, r.longitude, r.status]);
  }

  // 5. Seed WASH Knowledge Memory
  for (const k of WASH_KNOWLEDGE_BASE) {
    await query(`
      INSERT INTO wash_knowledge (id, category, title, content)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO NOTHING;
    `, [k.id, k.category, k.title, k.content]);
  }

  // 6. Seed Sample AI Interventions for Bako & Sheda
  await query(`
    INSERT INTO ai_interventions (id, community_id, title, diagnosis, proposed_actions, estimated_cost_ngn, priority, status)
    VALUES 
    (
      'int-bako-01',
      'bako',
      'Solar Riser Joint Overhaul & Impeller Flushing',
      'Physical telemetry indicates a 68% flow decline (19.5 -> 6.2 LPM) correlated with citizen reports of underground leakage. Failure pattern matches mechanical pipe riser coupling fatigue.',
      $1,
      45000,
      'CRITICAL',
      'PROPOSED'
    ),
    (
      'int-sheda-01',
      'sheda',
      'Rapid In-Line Coagulation & Filter Replacement Protocol',
      'Turbidity sensor reading 8.4 NTU (safe limit <5.0) compounded by citizen reports of clay sediment. Indicates surface runoff seepage into wellhead apron.',
      $2,
      32000,
      'HIGH',
      'PROPOSED'
    )
    ON CONFLICT (id) DO NOTHING;
  `, [
    JSON.stringify([
      'Deploy certified Kwali area maintenance technician with replacement 1.5-inch HDPE riser coupling',
      'Perform high-pressure impeller flush to clear laterite silt accumulation',
      'Recalibrate pressure transducer sensor after joint sealing'
    ]),
    JSON.stringify([
      'Isolate distribution manifold and distribute temporary 20L sodium hypochlorite kits to 150 households',
      'Excavate and cast 1.2m reinforced concrete sanitary apron around wellhead',
      'Flush and replace dual-stage silica-gravel filter cartridges'
    ])
  ]);

  return {
    success: true,
    message: 'Kwali WASH Digital Twin database successfully seeded with 10 communities, sensor streams, citizen reports, and knowledge base.',
  };
}
