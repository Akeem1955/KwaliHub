import { NextResponse } from 'next/server';
import { runBackfill } from '@/lib/simulate';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const days = body.days || 30; // Default to 30 days backfill
    
    await runBackfill(days);
    return NextResponse.json({ message: `Successfully backfilled ${days} days of data.` }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to run simulation backfill." }, { status: 500 });
  }
}
