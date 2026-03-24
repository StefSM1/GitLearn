import { PrismaClient } from '@prisma/client'

describe('Prisma Schema Validation', () => {
  let prisma: PrismaClient

  beforeAll(() => {
    prisma = new PrismaClient()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should instantiate Prisma client without errors', () => {
    expect(prisma).toBeDefined()
    expect(prisma.article).toBeDefined()
    expect(prisma.newsSource).toBeDefined()
    expect(prisma.article.findMany).toBeDefined()
  })
})
