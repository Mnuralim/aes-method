const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  console.log("Seeding admin...");

  const defaultAdmin = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME, 
  };

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: defaultAdmin.username },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash(defaultAdmin.password, 10);

    await prisma.admin.create({
      data: {
        username: defaultAdmin.username,
        password: hashedPassword,
        name: defaultAdmin.name,
      },
    });

    console.log("Admin seeded successfully!");
  } else {
    console.log("Admin already exists. Skipping seeding.");
  }
}

async function main() {
  await createAdmin();
}

main()
  .catch((e) => {
    console.error("Error seeding database", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
