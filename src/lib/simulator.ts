export type SimulationParams = {
  communityId: string;
  communityName: string;
  population: number;
  currentFlowLpm: number;
  currentTurbidityNtu: number;
  currentStatus: string;
  interventionCostNgn: number;
  projectedUptimeRecoveryPct: number;
  horizonDays: 7 | 30 | 90;
  userTariffPerJerrycanNgn?: number; // default ₦20
  dispatchDelayDays?: number; // days until technician reaches site (e.g. 1-3)
};

export type SimulationDayPoint = {
  day: number;
  date: string;
  baselineUptimePct: number;
  projectedUptimePct: number;
  projectedWaterVolumeLiters: number;
  baselineWaterVolumeLiters: number;
  reserveFundNgn: number;
  healthRiskIndex: number; // 0-100 (lower is better)
};

export type SimulationResult = {
  communityId: string;
  communityName: string;
  horizonDays: number;
  baselineUptimePct: number;
  projectedUptimePct: number;
  avoidedDowntimeHours: number;
  netWaterGainLiters: number;
  projectedTotalSpendNgn: number;
  reserveFundBalanceNgn: number;
  healthRiskReductionPct: number;
  breakEvenDay: number;
  trajectory: SimulationDayPoint[];
  verdict: 'HIGHLY_RECOMMENDED' | 'FEASIBLE' | 'REQUIRES_SUBSIDY';
  verdictNotes: string;
};

export function runDigitalTwinSimulation(params: SimulationParams): SimulationResult {
  const {
    communityId,
    communityName,
    population,
    currentFlowLpm,
    currentTurbidityNtu,
    currentStatus,
    interventionCostNgn,
    projectedUptimeRecoveryPct,
    horizonDays,
    userTariffPerJerrycanNgn = 20,
    dispatchDelayDays = 2,
  } = params;

  const trajectory: SimulationDayPoint[] = [];

  // Nominal daily demand in liters (standard 20L per capita per day)
  const nominalDailyDemand = population * 20;

  // Baseline flow rate degradation rate per day if left unattended
  const isDegraded = currentStatus === 'DEGRADED' || currentStatus === 'CRITICAL';
  const baselineDecayRate = isDegraded ? 0.03 : 0.005;

  let currentBaselineFlow = currentFlowLpm;
  let currentProjectedFlow = currentFlowLpm;
  let reserveFund = 0;
  let breakEvenDay = -1;

  let totalBaselineLiters = 0;
  let totalProjectedLiters = 0;

  const today = new Date();

  for (let d = 1; d <= horizonDays; d++) {
    const pointDate = new Date(today.getTime() + d * 86400000);
    const dateStr = pointDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // 1. Baseline simulation (No intervention): decay continues
    currentBaselineFlow = Math.max(0, currentBaselineFlow * (1 - baselineDecayRate));
    const baselineDailyHours = currentBaselineFlow > 0 ? (isDegraded ? 4.5 : 8.0) : 0;
    const baselineLiters = Math.round(currentBaselineFlow * 60 * baselineDailyHours);
    const baselineUptime = Math.max(5, Math.min(100, Math.round((currentBaselineFlow / 20.0) * 100)));
    totalBaselineLiters += baselineLiters;

    // 2. Projected simulation (With AI intervention deployed at day = dispatchDelayDays)
    let projectedUptime = baselineUptime;
    let turbidity = currentTurbidityNtu;

    if (d >= dispatchDelayDays) {
      // Recovery curve post-dispatch
      const recoveryProgress = Math.min(1, (d - dispatchDelayDays + 1) / 3.0); // 3 days to full stabilization
      projectedUptime = Math.round(baselineUptime + (projectedUptimeRecoveryPct - baselineUptime) * recoveryProgress);
      currentProjectedFlow = 6.0 + (19.5 - 6.0) * recoveryProgress;
      turbidity = Math.max(1.2, currentTurbidityNtu * (1 - recoveryProgress * 0.8));
    }

    const projectedDailyHours = (projectedUptime / 100) * 9.0;
    const projectedLiters = Math.round(currentProjectedFlow * 60 * projectedDailyHours);
    totalProjectedLiters += projectedLiters;

    // Financial revenue generation (tariff per 25L jerrycan)
    const dailyJerrycans = Math.floor(projectedLiters / 25);
    const dailyRevenueNgn = dailyJerrycans * userTariffPerJerrycanNgn;
    const dailyOpEx = 600; // steward stipend + minor consumable allocation
    const dailyNet = dailyRevenueNgn - dailyOpEx;

    if (d === dispatchDelayDays) {
      reserveFund -= interventionCostNgn; // capital expenditure upfront
    }
    reserveFund += Math.round(dailyNet * 0.4); // 40% retained for capital maintenance reserve

    if (breakEvenDay === -1 && reserveFund >= 0 && d > dispatchDelayDays) {
      breakEvenDay = d;
    }

    // Health risk score (0-100): derived from turbidity & availability deficit
    const availabilityDeficit = Math.max(0, (nominalDailyDemand - projectedLiters) / nominalDailyDemand);
    const turbidityPenalty = Math.min(50, turbidity * 5);
    const healthRiskIndex = Math.min(100, Math.round(availabilityDeficit * 50 + turbidityPenalty));

    trajectory.push({
      day: d,
      date: dateStr,
      baselineUptimePct: baselineUptime,
      projectedUptimePct: projectedUptime,
      projectedWaterVolumeLiters: projectedLiters,
      baselineWaterVolumeLiters: baselineLiters,
      reserveFundNgn: reserveFund,
      healthRiskIndex,
    });
  }

  const avgBaselineUptime = Math.round(
    trajectory.reduce((acc, t) => acc + t.baselineUptimePct, 0) / horizonDays
  );
  const avgProjectedUptime = Math.round(
    trajectory.reduce((acc, t) => acc + t.projectedUptimePct, 0) / horizonDays
  );

  const avoidedDowntimeHours = Math.round(((avgProjectedUptime - avgBaselineUptime) / 100) * (horizonDays * 12));
  const netWaterGainLiters = Math.max(0, totalProjectedLiters - totalBaselineLiters);

  const initialRisk = trajectory[0].healthRiskIndex;
  const finalRisk = trajectory[trajectory.length - 1].healthRiskIndex;
  const healthRiskReductionPct = initialRisk > 0 ? Math.max(0, Math.round(((initialRisk - finalRisk) / initialRisk) * 100)) : 0;

  let verdict: SimulationResult['verdict'] = 'HIGHLY_RECOMMENDED';
  let verdictNotes = 'Intervention quickly stabilizes water output, yields significant health risk reduction, and pays for itself within community maintenance reserves.';

  if (breakEvenDay === -1 || breakEvenDay > horizonDays) {
    if (avoidedDowntimeHours > 120) {
      verdict = 'FEASIBLE';
      verdictNotes = 'High public health and water access impact, but full capital recovery extends beyond current horizon; partial LGA co-financing recommended.';
    } else {
      verdict = 'REQUIRES_SUBSIDY';
      verdictNotes = 'Economic returns are constrained by low community volume; external municipal grant required.';
    }
  }

  return {
    communityId,
    communityName,
    horizonDays,
    baselineUptimePct: avgBaselineUptime,
    projectedUptimePct: avgProjectedUptime,
    avoidedDowntimeHours,
    netWaterGainLiters,
    projectedTotalSpendNgn: interventionCostNgn,
    reserveFundBalanceNgn: reserveFund,
    healthRiskReductionPct,
    breakEvenDay: breakEvenDay === -1 ? horizonDays + 15 : breakEvenDay,
    trajectory,
    verdict,
    verdictNotes,
  };
}
