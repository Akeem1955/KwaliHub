import { NextResponse } from 'next/server';
import { simulateTick } from '@/lib/simulate';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const days = typeof body.days === 'number' ? body.days : 1;

    const options = {
      forceFailure: typeof body.forceFailure === 'string' ? body.forceFailure : undefined,
      failureType: typeof body.failureType === 'string' ? body.failureType : undefined,
      waterQualityFail: typeof body.waterQualityFail === 'boolean' ? body.waterQualityFail : undefined,
      revenueMultiplier: typeof body.revenueMultiplier === 'number' ? body.revenueMultiplier : undefined,
    };

    const currentDate = new Date();
    for (let i = 0; i < days; i++) {
      const tickDate = new Date(currentDate);
      tickDate.setDate(currentDate.getDate() + i);
      await simulateTick(tickDate, options);
    }

    return NextResponse.json({
      message: `Successfully completed ${days} simulation tick(s).`,
      details: {
        days,
        options
      }
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to run simulation tick." }, { status: 500 });
  }
}
