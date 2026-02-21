import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.run(sql`SELECT 1`);

    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'error',
        db: 'disconnected',
        error: message,
      },
      { status: 500 },
    );
  }
}
