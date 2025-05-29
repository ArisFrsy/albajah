const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordPlain = "admin";

  // Hash password dengan salt rounds 10
  const hashedPassword = await bcrypt.hash(passwordPlain, 10);

  await prisma.user.create({
    data: {
      name: "admin",
      email: "aris.it.dev@gmail.com",
      password: hashedPassword,
      createdAt: new Date(),
    },
  });

  console.log("User admin created with hashed password");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
