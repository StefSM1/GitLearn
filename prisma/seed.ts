import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const sources = [
    { name: 'StaraZagora.bg', enabled: true, type: 'scraper' },
    { name: 'dev.bg', enabled: true, type: 'scraper' },
    { name: 'HackBulgaria', enabled: true, type: 'scraper' },
    { name: 'NewsAPI', enabled: true, type: 'api' },
  ]

  for (const source of sources) {
    await prisma.newsSource.upsert({
      where: { name: source.name },
      update: {},
      create: source,
    })
  }

  console.log('Seed completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
