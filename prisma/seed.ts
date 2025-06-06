const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordPlain = "admin";

  // Hash password dengan salt rounds 10
  const hashedPassword = await bcrypt.hash(passwordPlain, 10);

  // cerate multi user
  await prisma.user.createMany({
    data: [
      {
        name: "admin2",
        email: "ananta.firdaus2@gmail.com",
        password: hashedPassword,
        createdAt: new Date(),
      },
    ],
    skipDuplicates: true,
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
