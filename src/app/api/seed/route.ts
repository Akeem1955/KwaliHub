import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Database Seed Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to seed database.' },
      { status: 500 }
    );
  }
}
