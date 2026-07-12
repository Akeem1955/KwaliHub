import { NextResponse } from 'next/server';

export async function POST() {
  // Simulate a realistic Gemini rate limit or connection error
  await new Promise(resolve => setTimeout(resolve, 800)); // slight delay
  return NextResponse.json({ error: "Google Gemini API rate limit exceeded (429). Generating fallback." }, { status: 429 });
}
