import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalTerminals, processedTerminals, totalProposals, totalNudges] =
      await Promise.all([
        prisma.terminal.count(),
        prisma.terminal.count({
          where: { proposals: { some: { status: 'PENDING' } } },
        }),
        prisma.proposal.count(),
        prisma.nudge.count(),
      ]);

    return NextResponse.json({
      totalTerminals,
      processedTerminals,
      remainingTerminals: totalTerminals - processedTerminals,
      totalProposals,
      totalNudges,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch twin status.' },
      { status: 500 },
    );
  }
}
