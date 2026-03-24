import { Octokit } from '@octokit/rest';
import { prisma } from '../db';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Optional, but helps with rate limits
});

export async function searchByTopic(topic: string, limit: number = 10) {
  try {
    const response = await octokit.rest.search.repos({
      q: `topic:${topic}`,
      sort: 'stars',
      order: 'desc',
      per_page: limit,
    });
    return response.data.items;
  } catch (error) {
    console.error('Error searching GitHub by topic:', error);
    throw error;
  }
}

export async function getMostStarred(language?: string, limit: number = 10) {
  try {
    const query = language ? `language:${language}` : 'stars:>10000';
    const response = await octokit.rest.search.repos({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: limit,
    });
    return response.data.items;
  } catch (error) {
    console.error('Error getting most starred GitHub repos:', error);
    throw error;
  }
}

export async function getTrending(period: 'daily' | 'weekly', limit: number = 10) {
  try {
    // A rough approximation of trending: repos created recently with most stars
    const date = new Date();
    if (period === 'daily') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() - 7);
    }
    
    const dateString = date.toISOString().split('T')[0];
    
    const response = await octokit.rest.search.repos({
      q: `created:>=${dateString}`,
      sort: 'stars',
      order: 'desc',
      per_page: limit,
    });
    return response.data.items;
  } catch (error) {
    console.error('Error getting trending GitHub repos:', error);
    throw error;
  }
}

export async function syncTrendingRepos() {
  const sourceName = 'GitHub';
  try {
    const repos = await getTrending('weekly', 15);
    let savedCount = 0;

    for (const repo of repos) {
      if (!repo.html_url || !repo.full_name) continue;

      const result = await prisma.article.upsert({
        where: { url: repo.html_url },
        update: {},
        create: {
          title: `[Trending] ${repo.full_name}: ${repo.description || 'No description'}`,
          url: repo.html_url,
          source: sourceName,
          location: 'Global',
          category: 'github-repo'
        }
      });
      if (result) savedCount++;
    }

    await prisma.scrapeLog.create({
      data: {
        source: sourceName,
        status: 'success',
        articles: savedCount,
        message: 'Successfully synced trending GitHub repositories.',
      }
    });

    return { status: 'success', count: savedCount };
  } catch (error: any) {
    console.error(`Error syncing from ${sourceName}:`, error.message);
    await prisma.scrapeLog.create({
      data: {
        source: sourceName,
        status: 'error',
        message: error.message || 'Unknown error occurred',
        articles: 0
      }
    });
    return { status: 'error', error: error.message };
  }
}
