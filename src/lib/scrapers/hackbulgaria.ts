import { chromium } from 'playwright';
import { prisma } from '../db';

export async function scrapeHackBulgaria() {
  const sourceName = 'HackBulgaria';
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://hackbulgaria.com/courses/', { waitUntil: 'domcontentloaded', timeout: 30000 });

    const articlesData = await page.evaluate(() => {
      const selectors = ['.course-card', '.card.course'];
      const articles: { title: string; url: string }[] = [];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach(el => {
            const linkEl = el.querySelector('a');
            const titleEl = el.querySelector('h3, h4, .title');
            if (linkEl && linkEl.href && titleEl && titleEl.textContent) {
               articles.push({
                 title: titleEl.textContent.trim(),
                 url: linkEl.href
               });
            }
          });
          break;
        }
      }
      return articles;
    });

    let savedCount = 0;
    for (const article of articlesData) {
      if (!article.url || !article.title) continue;
      
      const result = await prisma.article.upsert({
         where: { url: article.url },
         update: {},
         create: {
           title: article.title,
           url: article.url,
           source: sourceName,
           location: 'Bulgaria',
           category: 'tech-education'
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
        message: 'Successfully scraped HackBulgaria courses.',
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
