import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = 'admin';
  const rawPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // Check if admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`Seeding success! Account created.`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${rawPassword}`);
  } else {
    console.log(`Admin user already exists. Seeding skipped.`);
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
