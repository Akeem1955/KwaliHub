import { NextResponse } from 'next/server';
import { simulateTick } from '@/lib/simulate';

export async function POST() {
  try {
    await simulateTick();
    return NextResponse.json({ message: "Simulation tick completed successfully." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to run simulation tick." }, { status: 500 });
  }
}
