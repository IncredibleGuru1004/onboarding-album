import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.auction.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Note: Verified users have null verification tokens
  // Unverified users have a token and expiration date

  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: hashedPassword,
      name: 'John Doe',
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    },
  });

  // Create a user with unverified email (with a verification token for demonstration)
  const verificationTokenExpires = new Date();
  verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24); // 24 hours from now

  const user3 = await prisma.user.create({
    data: {
      email: 'bob.wilson@example.com',
      password: hashedPassword,
      name: 'Bob Wilson',
      emailVerified: false,
      emailVerificationToken: 'sample-verification-token-12345', // Sample token for testing
      emailVerificationTokenExpires: verificationTokenExpires,
    },
  });

  console.log(`✅ Created ${4} users`);

  // Create Categories
  console.log('📁 Creating categories...');
  const category1 = await prisma.category.create({
    data: {
      title: 'Watches',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      title: 'Furniture',
    },
  });

  const category3 = await prisma.category.create({
    data: {
      title: 'Weapons',
    },
  });

  const category4 = await prisma.category.create({
    data: {
      title: 'Art & Collectibles',
    },
  });

  const category5 = await prisma.category.create({
    data: {
      title: 'Electronics',
    },
  });

  console.log(`✅ Created ${5} categories`);

  // Create Auctions
  console.log('🔨 Creating auctions...');
  const auctions = [
    {
      title: 'Vintage Rolex Submariner',
      image: '/images/auctions/rolex.png',
      categoryID: category1.id,
      userId: user1.id,
    },
    {
      title: 'Antique Oak Dining Table',
      image: '/images/furniture.png',
      categoryID: category2.id,
      userId: user1.id,
    },
    {
      title: 'Medieval Sword Collection',
      image: '/images/weapons.png',
      categoryID: category3.id,
      userId: user2.id,
    },
    {
      title: 'Rare Vintage Watch',
      image: '/images/watches.png',
      categoryID: category1.id,
      userId: user2.id,
    },
    {
      title: 'Modern Leather Sofa',
      image: '/images/furniture.png',
      categoryID: category2.id,
      userId: user3.id,
    },
    {
      title: 'Abstract Art Painting',
      image: '/images/auctions/art.png',
      categoryID: category4.id,
      userId: user1.id,
    },
    {
      title: 'Classic Pocket Watch',
      image: '/images/watches.png',
      categoryID: category1.id,
      userId: user3.id,
    },
    {
      title: 'Vintage Camera Collection',
      image: '/images/auctions/camera.png',
      categoryID: category5.id,
      userId: user2.id,
    },
    {
      title: 'Antique Chair Set',
      image: '/images/furniture.png',
      categoryID: category2.id,
      userId: user1.id,
    },
    {
      title: 'Rare Coin Collection',
      image: '/images/auctions/coins.png',
      categoryID: category4.id,
      userId: user3.id,
    },
    {
      title: 'Luxury Timepiece',
      image: '/images/watches.png',
      categoryID: category1.id,
      userId: user1.id,
    },
    {
      title: 'Designer Coffee Table',
      image: '/images/furniture.png',
      categoryID: category2.id,
      userId: user2.id,
    },
    {
      title: 'Historical Artifact',
      image: '/images/auctions/artifact.png',
      categoryID: category4.id,
      userId: user3.id,
    },
    {
      title: 'Smart Watch Pro',
      image: '/images/watches.png',
      categoryID: category1.id,
      userId: user2.id,
    },
    {
      title: 'Vintage Desk',
      image: '/images/furniture.png',
      categoryID: category2.id,
      userId: user1.id,
    },
    {
      title: 'Collectible Stamps',
      image: '/images/auctions/stamps.png',
      categoryID: category4.id,
      userId: user3.id,
    },
    {
      title: 'Premium Watch Collection',
      image: '/images/watches.png',
      categoryID: category1.id,
      userId: user1.id,
    },
    {
      title: 'Modern Bookshelf',
      image: '/images/furniture.png',
      categoryID: category2.id,
      userId: user2.id,
    },
    {
      title: 'Rare Painting',
      image: '/images/auctions/painting.png',
      categoryID: category4.id,
      userId: user3.id,
    },
    {
      title: 'Classic Timepiece',
      image: '/images/watches.png',
      categoryID: category1.id,
      userId: user1.id,
    },
  ];

  for (const auction of auctions) {
    await prisma.auction.create({
      data: auction as any,
    });
  }

  console.log(`✅ Created ${auctions.length} auctions`);

  console.log('✨ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${4} (3 regular, 1 OAuth)`);
  console.log(`   - Categories: ${5}`);
  console.log(`   - Auctions: ${auctions.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
