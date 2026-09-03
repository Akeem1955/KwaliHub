import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { runDigitalTwinSimulation } from '@/lib/simulator';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      communityId,
      interventionId,
      horizonDays = 30,
      userTariff = 20,
      dispatchDelay = 2,
    } = body;

    if (!communityId) {
      return NextResponse.json(
        { success: false, error: 'communityId is required.' },
        { status: 400 }
      );
    }

    // 1. Fetch community & water point
    const comms = await query(`
      SELECT 
        c.id, c.name, c.population, wp.status, wp.flow_rate_lpm, wp.turbidity_ntu
      FROM communities c
      JOIN water_points wp ON wp.community_id = c.id
      WHERE c.id = $1;
    `, [communityId]);

    if (comms.length === 0) {
      return NextResponse.json(
        { success: false, error: `Community ${communityId} not found.` },
        { status: 404 }
      );
    }

    const c = comms[0];

    // 2. Fetch or default intervention
    let interventionCost = 40000;
    let targetRecovery = 95;

    if (interventionId) {
      const ints = await query('SELECT estimated_cost_ngn FROM ai_interventions WHERE id = $1', [interventionId]);
      if (ints.length > 0) {
        interventionCost = ints[0].estimated_cost_ngn;
      }
    }

    // 3. Run predictive Digital Twin simulation
    const simulationResult = runDigitalTwinSimulation({
      communityId: c.id,
      communityName: c.name,
      population: c.population || 3000,
      currentFlowLpm: c.flow_rate_lpm || 18.0,
      currentTurbidityNtu: c.turbidity_ntu || 2.0,
      currentStatus: c.status || 'OPERATIONAL',
      interventionCostNgn: interventionCost,
      projectedUptimeRecoveryPct: targetRecovery,
      horizonDays: horizonDays === 7 || horizonDays === 90 ? horizonDays : 30,
      userTariffPerJerrycanNgn: Number(userTariff) || 20,
      dispatchDelayDays: Number(dispatchDelay) || 2,
    });

    // 4. Save simulation run in database
    const runId = `sim-${communityId}-${Date.now()}`;
    await query(`
      INSERT INTO simulation_runs (
        id, intervention_id, community_id, scenario_days, baseline_uptime_pct,
        projected_uptime_pct, projected_cost_ngn, projected_water_yield_liters,
        avoided_downtime_hours, health_risk_reduction_pct, trajectory
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
    `, [
      runId,
      interventionId || null,
      communityId,
      simulationResult.horizonDays,
      simulationResult.baselineUptimePct,
      simulationResult.projectedUptimePct,
      simulationResult.projectedTotalSpendNgn,
      simulationResult.netWaterGainLiters,
      simulationResult.avoidedDowntimeHours,
      simulationResult.healthRiskReductionPct,
      JSON.stringify(simulationResult.trajectory),
    ]);

    if (interventionId) {
      await query("UPDATE ai_interventions SET status = 'SIMULATED' WHERE id = $1", [interventionId]);
    }

    return NextResponse.json({
      success: true,
      simulation: {
        id: runId,
        ...simulationResult,
      },
    });
  } catch (error: any) {
    console.error('POST /api/twin/simulate Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to execute Digital Twin simulation.' },
      { status: 500 }
    );
  }
}
