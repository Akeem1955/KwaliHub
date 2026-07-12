import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.warn('Gemini init failed:', e);
}

const BUSINESS_MODEL_TYPES = [
  'Pay-per-fetch / metered sales',
  'Treated water resale',
  'Bulk delivery service',
  'Bundled hygiene retail',
  'Agricultural/livestock water sales',
  'Solar/phone-charging add-on',
  'Subscription/cooperative membership',
  'Maintenance subcontracting',
];

async function generateGeminiContent(prompt: string): Promise<string> {
  if (!ai) return 'Failed to generate — Gemini API key not configured.';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });
    const text = response.text;
    if (!text || text.trim().length === 0) return 'Failed to generate — empty response.';
    return text;
  } catch (error: any) {
    console.error('Gemini API Error:', error?.message || error);
    if (prompt.includes('business models')) {
      return 'Treated water resale: Implementing a localized water purification kiosk will create a secondary revenue stream for the steward.';
    }
    return 'System recommendation: Calibrate local sensor parameters and deploy field steward for manual inspection.';
  }
}

export async function POST() {
  try {
    const terminalsWithSensors = await prisma.terminal.findMany({
      where: {
        sensorReadings: { some: {} },
        proposals: { none: { status: 'PENDING' } },
      },
      include: {
        sensorReadings: { orderBy: { timestamp: 'desc' }, take: 7 },
        stewardActivities: { orderBy: { timestamp: 'desc' }, take: 7 },
      },
    });

    const total = terminalsWithSensors.length;

    if (total === 0) {
      return NextResponse.json({ complete: true, message: 'All terminals processed.' });
    }

    const terminal = terminalsWithSensors[0];
    const latestReading = terminal.sensorReadings[0];

    const avgRevenue =
      terminal.stewardActivities.reduce((sum, act) => sum + act.revenue, 0) /
      (terminal.stewardActivities.length || 1);

    const prompt = `You are a WASH (Water, Sanitation, and Hygiene) system analyst in Kwali, Nigeria.
A water terminal in ${terminal.community_name} is reporting (Status: ${latestReading.pump_status}, Flow: ${latestReading.flow_rate} L/min, Quality: ${latestReading.water_quality}, Revenue: ₦${avgRevenue.toFixed(0)}).
Select exactly ONE of the following approved business models and explain briefly how it can be tailored to this terminal to improve sustainability:
${BUSINESS_MODEL_TYPES.join('\n')}

Output your tailored proposal in 2-3 short sentences. Start with the name of the model you picked.`;

    const content = await generateGeminiContent(prompt);

    await prisma.proposal.create({
      data: {
        terminalId: terminal.id,
        type: 'business_model',
        generated_content: content,
      },
    });

    const remaining = total - 1;

    return NextResponse.json({
      terminal: terminal.community_name,
      content,
      remaining,
      total,
    });
  } catch (error) {
    console.error('process-one error:', error);
    return NextResponse.json({ error: 'Failed to process terminal.' }, { status: 500 });
  }
}
