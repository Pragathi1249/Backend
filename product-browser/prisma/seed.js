const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Toys",
  "Home"
];

function randomCategory() {
  return categories[
    Math.floor(Math.random() * categories.length)
  ];
}

function randomPrice() {
  return Number(
    (Math.random() * 5000).toFixed(2)
  );
}

function randomDate() {
  const now = Date.now();
  const yearAgo =
    now - 365 * 24 * 60 * 60 * 1000;

  return new Date(
    yearAgo +
      Math.random() * (now - yearAgo)
  );
}

async function main() {
  const total = 200000;
  const batchSize = 5000;

  console.log("Starting seed...");

  for (
    let i = 0;
    i < total;
    i += batchSize
  ) {
    const products = [];

    for (
      let j = 0;
      j < batchSize &&
      i + j < total;
      j++
    ) {
      products.push({
        name: `Product ${i + j + 1}`,
        category: randomCategory(),
        price: randomPrice(),
        createdAt: randomDate(),
        updatedAt: randomDate()
      });
    }

    await prisma.product.createMany({
      data: products
    });

    console.log(
      `Inserted ${Math.min(
        i + batchSize,
        total
      )}/${total}`
    );
  }

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });