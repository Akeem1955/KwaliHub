import { prisma } from './prisma';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client. If API key is missing, it will throw, so we catch later.
let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
  console.warn("Gemini API initialization failed (missing key?).");
}

const BUSINESS_MODEL_TYPES = [
  "Pay-per-fetch / metered sales",
  "Treated water resale",
  "Bulk delivery service",
  "Bundled hygiene retail",
  "Agricultural/livestock water sales",
  "Solar/phone-charging add-on",
  "Subscription/cooperative membership",
  "Maintenance subcontracting"
];

async function generateGeminiContent(prompt: string): Promise<string> {
  if (!ai) return "Failed to generate — try again";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Failed to generate — try again";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate — try again";
  }
}

export async function processDigitalTwin() {
  const terminals = await prisma.terminal.findMany({
    include: {
      sensorReadings: {
        orderBy: { timestamp: 'desc' },
        take: 7 // Last 7 readings (1 week of data)
      },
      stewardActivities: {
        orderBy: { timestamp: 'desc' },
        take: 7
      },
      households: true
    }
  });

  for (const terminal of terminals) {
    if (terminal.sensorReadings.length === 0) continue;

    const latestReading = terminal.sensorReadings[0];
    const isFailing = latestReading.pump_status === "BROKEN" || latestReading.pump_status === "DEGRADED";
    
    // 1. Business Model Proposal Generation
    const avgRevenue = terminal.stewardActivities.reduce((sum, act) => sum + act.revenue, 0) / (terminal.stewardActivities.length || 1);
    
    if (isFailing || avgRevenue < 1000) {
      const existing = await prisma.proposal.findFirst({
        where: { terminalId: terminal.id, status: "PENDING", type: "business_model" }
      });

      if (!existing) {
        const prompt = `You are a WASH (Water, Sanitation, and Hygiene) system analyst in Kwali, Nigeria. 
A water terminal in ${terminal.community_name} is failing (Status: ${latestReading.pump_status}, Revenue: ₦${avgRevenue}).
Select exactly ONE of the following approved business models and explain briefly how it can be tailored to this terminal to improve sustainability:
${BUSINESS_MODEL_TYPES.join('\n')}

Output your tailored proposal in 2-3 short sentences. Start with the name of the model you picked.`;
        
        const content = await generateGeminiContent(prompt);
        
        await prisma.proposal.create({
          data: {
            terminalId: terminal.id,
            type: "business_model",
            generated_content: content,
          }
        });
      }
    }

    // 2. Sanitation Design Proposal Generation
    if (Math.random() > 0.8) {
      const existingDesign = await prisma.proposal.findFirst({
        where: { terminalId: terminal.id, status: "PENDING", type: "sanitation_design" }
      });

      if (!existingDesign) {
        const prompt = `Propose an innovative, sustainable sanitation design (e.g., eco-latrine) for the community of ${terminal.community_name}. Keep it strictly to 2 short sentences.`;
        const content = await generateGeminiContent(prompt);
        await prisma.proposal.create({
          data: {
            terminalId: terminal.id,
            type: "sanitation_design",
            generated_content: content
          }
        });
      }
    }

    // 3. Personalized Household Nudges
    for (const household of terminal.households) {
      if (!household.consent_logged) continue; 

      const prompt = `Write a short SMS text message (under 100 characters) to a household in ${terminal.community_name} encouraging them to use the local water point. Their primary barrier to using it is: "${household.stated_barrier}". Be persuasive but polite.`;
      const nudgeText = await generateGeminiContent(prompt);
      
      await prisma.nudge.create({
        data: {
          householdId: household.id,
          message_text: nudgeText,
          channel: "sms",
          status: "GENERATED"
        }
      });
    }
  }

  return { message: "Digital Twin processed successfully." };
}
