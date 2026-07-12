import { NextResponse } from 'next/server';
import { seedSimulation } from '@/lib/simulate';

export async function POST() {
  try {
    await seedSimulation();
    return NextResponse.json({ message: "Successfully seeded 15 communities, stewards, and households." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to initialize ecosystem." }, { status: 500 });
  }
}
