import { NextResponse } from 'next/server';
import { processDigitalTwin } from '@/lib/digitalTwin';

export async function POST() {
  try {
    const result = await processDigitalTwin();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process Digital Twin." }, { status: 500 });
  }
}
