import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@peakfuel.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log(`Admin user already exists: ${adminEmail}`);
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 12);
  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashed,
      firstName: 'Store',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
      emailVerified: true,
    },
  });

  console.log(`Created admin user: ${adminEmail}`);
  console.log('IMPORTANT: change this password immediately after first login.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
