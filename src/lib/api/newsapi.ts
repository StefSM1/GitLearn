import { prisma } from '../db';
import axios from 'axios';

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || 'dummy_key';
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

export async function fetchTechNews() {
  const sourceName = 'NewsAPI';

  try {
    if (NEWSAPI_KEY === 'dummy_key' && process.env.NODE_ENV !== 'test') {
      console.warn('NEWSAPI_KEY is not set. Using dummy data or skipping if real fetch is required.');
      // For the sake of this demo, if dummy we just return a fake success but don't fail drastically.
    }

    const response = await axios.get(`${NEWSAPI_BASE_URL}/top-headlines`, {
      params: {
        category: 'technology',
        language: 'en',
        apiKey: NEWSAPI_KEY,
        pageSize: 20
      }
    });

    const articles = response.data.articles || [];
    let savedCount = 0;

    for (const article of articles) {
      if (!article.url || !article.title) continue;

      const result = await prisma.article.upsert({
        where: { url: article.url },
        update: {},
        create: {
          title: article.title,
          url: article.url,
          source: sourceName,
          location: 'Global',
          category: 'tech-news'
        }
      });
      if (result) savedCount++;
    }

    await prisma.scrapeLog.create({
      data: {
        source: sourceName,
        status: 'success',
        articles: savedCount,
        message: 'Successfully fetched tech news from NewsAPI.',
      }
    });

    return { status: 'success', count: savedCount };
  } catch (error: any) {
    console.error(`Error fetching from ${sourceName}:`, error.message);
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
