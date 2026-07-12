import { NextResponse } from 'next/server';
import { wipeDatabase } from '@/lib/simulate';

export async function POST() {
  try {
    await wipeDatabase();
    return NextResponse.json({ message: "System state has been reset completely. The database is now empty." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to wipe the database." }, { status: 500 });
  }
}
