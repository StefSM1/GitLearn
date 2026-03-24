import { scrapeStaraZagora } from './starazagora';
import { scrapeDevBg } from './devbg';
import { scrapeHackBulgaria } from './hackbulgaria';
import { prisma } from '../db';

export async function runAllScrapers() {
  const sources = await prisma.newsSource.findMany({ where: { enabled: true } });
  const results: any[] = [];

  for (const source of sources) {
    if (source.name === 'StaraZagora.bg') {
      const res = await scrapeStaraZagora();
      results.push({ source: source.name, ...res });
    } else if (source.name === 'dev.bg') {
      const res = await scrapeDevBg();
      results.push({ source: source.name, ...res });
    } else if (source.name === 'HackBulgaria') {
      const res = await scrapeHackBulgaria();
      results.push({ source: source.name, ...res });
    }
  }

  return results;
}

export async function runScraperBySource(sourceName: string) {
  if (sourceName === 'StaraZagora.bg') return await scrapeStaraZagora();
  if (sourceName === 'dev.bg') return await scrapeDevBg();
  if (sourceName === 'HackBulgaria') return await scrapeHackBulgaria();
  throw new Error('Unknown source');
}
