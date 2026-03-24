import { prisma } from './src/lib/db';

async function main() {
  console.log('Fields on prisma:', Object.keys(prisma));
  console.log('Source field:', (prisma as any).source);
}

main().catch(console.error);
