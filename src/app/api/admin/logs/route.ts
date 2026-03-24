import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/db';

/**
 * Fetch latest scrape logs.
 */
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');

  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const logs = await prisma.scrapeLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
