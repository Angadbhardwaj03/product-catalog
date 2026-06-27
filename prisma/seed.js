const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 200,000 products...');
  
  // Truncate existing data if needed (optional)
  // await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`);

  // Using PostgreSQL generate_series for instantaneous batch insertion
  const query = `
    INSERT INTO "Product" (id, name, category, price, created_at, updated_at)
    SELECT 
      gen_random_uuid(),
      'Product ' || i,
      (ARRAY['Books', 'Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'])[floor(random() * 6 + 1)],
      (random() * 1000 + 10)::numeric(10, 2),
      NOW() - (random() * (interval '365 days')),
      NOW() - (random() * (interval '30 days'))
    FROM generate_series(1, 200000) AS s(i);
  `;

  await prisma.$executeRawUnsafe(query);
  console.log('Successfully seeded 200,000 products in a single raw query!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
