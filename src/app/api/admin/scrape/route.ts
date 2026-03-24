import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { runAllScrapers, runScraperBySource } from '@/lib/scrapers';
import { fetchTechNews } from '@/lib/api/newsapi';
import { syncTrendingRepos } from '@/lib/api/github';

/**
 * Manually trigger scapers.
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session');

  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { source } = await request.json().catch(() => ({}));
    let results;

    if (source === 'all' || !source) {
      // Triggering everything
      const scraperResults = await runAllScrapers();
      const apiResults = await fetchTechNews();
      const gitResults = await syncTrendingRepos();
      results = { scraperResults, apiResults, gitResults };
    } else if (source === 'NewsAPI') {
      results = await fetchTechNews();
    } else {
      results = await runScraperBySource(source);
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Trigger error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
