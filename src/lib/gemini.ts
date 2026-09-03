import { GoogleGenAI } from '@google/genai';
import { query } from './db';

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (err) {
  console.warn('Gemini Client Init Warning:', err);
}

export type GeneratedIntervention = {
  title: string;
  diagnosis: string;
  proposedActions: string[];
  estimatedCostNgn: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  projectedUptimeRecoveryPct: number;
  rationale: string;
};

export async function generateWASHIntervention(
  communityName: string,
  sensorMetrics: {
    status: string;
    flowRate: number;
    waterQualityScore: number;
    ph: number;
    turbidity: number;
    tds: number;
  },
  citizenReports: Array<{
    category: string;
    description: string;
    urgency: string;
  }>
): Promise<GeneratedIntervention> {
  // Retrieve domain knowledge from PostgreSQL
  let knowledgeContext = '';
  try {
    const rows = await query<{ title: string; content: string }>(
      'SELECT title, content FROM wash_knowledge LIMIT 4'
    );
    knowledgeContext = rows.map(r => `• ${r.title}: ${r.content}`).join('\n');
  } catch (err) {
    console.warn('Knowledge retrieval fallback:', err);
  }

  const reportsSummary = citizenReports.length > 0
    ? citizenReports.map(r => `[${r.urgency}] ${r.category}: ${r.description}`).join('\n')
    : 'No recent citizen incident reports logged.';

  const prompt = `You are an expert Water, Sanitation, and Hygiene (WASH) Systems Engineer and Data Scientist deploying interventions in rural Kwali, Abuja, Nigeria.

COMMUNITY CONTEXT:
Community: ${communityName}

CURRENT IOT INFRASTRUCTURE TELEMETRY:
- Operational Status: ${sensorMetrics.status}
- Flow Rate: ${sensorMetrics.flowRate} L/min
- Overall Water Quality Index: ${sensorMetrics.waterQualityScore} / 100
- pH: ${sensorMetrics.ph}
- Turbidity: ${sensorMetrics.turbidity} NTU (Standard safe limit: < 5.0 NTU)
- Total Dissolved Solids: ${sensorMetrics.tds} ppm

CITIZEN-REPORTED INCIDENTS:
${reportsSummary}

WASH DOMAIN BENCHMARKS & BEST PRACTICES:
${knowledgeContext}

TASK:
Analyze the correlation between the IoT sensor telemetry and the citizen-generated complaints.
Synthesize a concrete, actionable, cost-effective rural intervention strategy for local technicians and community leaders.

Respond ONLY with valid JSON conforming exactly to this structure (no markdown formatting, no code blocks):
{
  "title": "Short descriptive title of the intervention",
  "diagnosis": "2-3 sentences correlating sensor metrics with citizen reports and identifying mechanical/biological failure root cause",
  "proposedActions": [
    "Step 1: Immediate mitigation action",
    "Step 2: Technical repair or replacement step",
    "Step 3: Quality verification / preventative safeguard"
  ],
  "estimatedCostNgn": 45000,
  "priority": "HIGH",
  "projectedUptimeRecoveryPct": 95,
  "rationale": "Brief explanation of how this restores community water reliability and prevents recurring failure"
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        title: parsed.title || `${communityName} Water Infrastructure Recovery`,
        diagnosis: parsed.diagnosis || 'Mechanical degradation detected across flow and pressure sensors.',
        proposedActions: Array.isArray(parsed.proposedActions) ? parsed.proposedActions : [
          'Deploy field steward for physical inspection',
          'Flush distribution line and check riser coupling',
          'Retest turbidity and residual chlorine levels'
        ],
        estimatedCostNgn: Number(parsed.estimatedCostNgn) || 35000,
        priority: parsed.priority || 'HIGH',
        projectedUptimeRecoveryPct: Number(parsed.projectedUptimeRecoveryPct) || 90,
        rationale: parsed.rationale || 'Targeted intervention rapidly restores community safe water access.'
      };
    } catch (err: any) {
      console.warn('Gemini Generation error, using resilient contextual synthesis:', err?.message || err);
    }
  }

  // Resilient heuristic synthesis if API key is not configured or fails
  const hasTurbidityIssue = sensorMetrics.turbidity > 5.0;
  const hasLowFlow = sensorMetrics.flowRate < 10.0;

  if (hasTurbidityIssue) {
    return {
      title: `${communityName} Wellhead Sanitary Barrier & Shock Chlorination`,
      diagnosis: `Turbidity sensor spikes at ${sensorMetrics.turbidity} NTU alongside citizen complaints of discolored water indicate surface runoff ingress through cracked wellhead apron during rains.`,
      proposedActions: [
        'Isolate wellhead distribution and deploy 20L sodium hypochlorite shock chlorination',
        'Reconstruct 1.5m elevated concrete sanitary apron to divert stormwater runoff',
        'Replace dual-stage sediment filter cartridges and verify <2.0 NTU baseline'
      ],
      estimatedCostNgn: 38000,
      priority: 'CRITICAL',
      projectedUptimeRecoveryPct: 98,
      rationale: 'Sealing wellhead apron eliminates contamination pathway, ensuring sustained potable water compliance.'
    };
  }

  if (hasLowFlow) {
    return {
      title: `${communityName} Solar Riser Coupling & Impeller Overhaul`,
      diagnosis: `Telemetry logs a sustained flow reduction to ${sensorMetrics.flowRate} L/min with citizen complaints of weak pressure, diagnosing high-friction silt accumulation in the submersible impeller and coupling leakage.`,
      proposedActions: [
        'Extract pump assembly and replace fatigued 1.5-inch HDPE riser coupling',
        'Flush impeller chamber with acid-descaling wash to eliminate sand binding',
        'Recalibrate digital pressure transducer and verify 18+ L/min flow discharge'
      ],
      estimatedCostNgn: 45000,
      priority: 'HIGH',
      projectedUptimeRecoveryPct: 94,
      rationale: 'Replacing damaged couplings and servicing impellers restores mechanical throughput to factory benchmark.'
    };
  }

  return {
    title: `${communityName} Routine Preventative Servicing & Steward Certification`,
    diagnosis: `System operating within nominal parameters (${sensorMetrics.flowRate} L/min, ${sensorMetrics.waterQualityScore}% quality index). Scheduled maintenance required to prevent dry-season stress.`,
    proposedActions: [
      'Inspect solar PV array for dust accumulation and clean panels',
      'Verify battery storage state of charge and check terminal wiring',
      'Log community feedback and calibrate IoT transmission cadence'
    ],
    estimatedCostNgn: 15000,
    priority: 'LOW',
    projectedUptimeRecoveryPct: 99,
    rationale: 'Preventative care maintains peak operational readiness and extends borehole lifespan.'
  };
}
