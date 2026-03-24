import { chromium } from 'playwright';
import { prisma } from '../db';

export async function scrapeStaraZagora() {
  const sourceName = 'StaraZagora.bg';
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://starazagora.bg/bg/news', { waitUntil: 'domcontentloaded', timeout: 30000 });

    const articlesCount = await page.evaluate(() => {
      // Fallback selectors for resilience
      const selectors = ['.news-list-item', 'article.news-item', '.post-item'];
      const articles: { title: string; url: string }[] = [];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach(el => {
            const linkEl = el.querySelector('a');
            const titleEl = el.querySelector('.title, h2, h3');
            if (linkEl && linkEl.href && titleEl && titleEl.textContent) {
               articles.push({
                 title: titleEl.textContent.trim(),
                 url: linkEl.href
               });
            }
          });
          break; // Stop at first matched selector
        }
      }
      return articles;
    });

    let savedCount = 0;
    for (const article of articlesCount) {
      if (!article.url || !article.title) continue;
      
      // Upsert to DB
      const result = await prisma.article.upsert({
         where: { url: article.url },
         update: {},
         create: {
           title: article.title,
           url: article.url,
           source: sourceName,
           location: 'Stara Zagora',
           category: 'news'
         }
      });
      if (result) savedCount++;
    }

    await browser.close();

    await prisma.scrapeLog.create({
      data: {
        source: sourceName,
        status: 'success',
        articles: savedCount,
        message: 'Successfully scraped articles.',
      }
    });

    return { status: 'success', count: savedCount };
  } catch (error: any) {
    console.error(`Error scraping ${sourceName}:`, error);
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
