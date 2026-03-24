import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/db';

/**
 * Manage sources toggle.
 */
export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');

  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sources = await prisma.newsSource.findMany();
    return NextResponse.json(sources);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');

  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, enabled } = await request.json();
    
    if (typeof id !== 'number' || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const updatedSource = await prisma.newsSource.update({
      where: { id },
      data: { enabled },
    });

    return NextResponse.json(updatedSource);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
