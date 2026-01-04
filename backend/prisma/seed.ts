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
  const hashedPassword = await bcrypt.hash('123123123', 10);

  const user1 = await prisma.user.create({
    data: {
      id: '246d8e04-96cd-4ce8-b355-39e8d7982e2b',
      email: 'tinkerbobbledev@gmail.com',
      password: hashedPassword,
      name: 'Tinker Bobble',
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: '94810aac-0489-4f97-bb84-c11636531884',
      email: 'tinkercrankdev@gmail.com',
      name: 'Fairy TinkerCrank',
      googleId: '103356563296287659761',
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    },
  });

  console.log(`✅ Created ${2} users`);

  // Create Categories
  console.log('📁 Creating categories...');
  const category1 = await prisma.category.create({
    data: {
      id: '31ac8325-1e0d-4d90-b9b2-025b642bc989',
      title: 'Watches',
      image: 'images/cf6a3dca-04e3-4bc0-815c-a59acf5fa7ca.png',
    } as any,
  });

  const category2 = await prisma.category.create({
    data: {
      id: '35526e80-4a7e-48d4-b665-a3ecf052647f',
      title: 'Furniture',
      image: 'images/1e3605fe-cadb-4512-8fb6-4f102b51e4b7.png',
    } as any,
  });

  const category3 = await prisma.category.create({
    data: {
      id: '407d018a-6ee0-4947-b4c7-9ce945968679',
      title: 'Keep',
      image: 'images/7f534c14-623a-4fc8-b8d4-e45eee23ad5a.png',
    } as any,
  });

  const category4 = await prisma.category.create({
    data: {
      id: '4c3d2c0e-bc19-44e9-8946-064e24526b15',
      title: 'Statues',
      image: 'images/3a297e65-6828-41d9-a662-dbbee036c9ad.png',
    } as any,
  });

  const category5 = await prisma.category.create({
    data: {
      id: '5ff8d0fc-75b4-478b-8b5a-34729ccb35c0',
      title: 'Skulls',
      image: 'images/08a2ea84-1011-4e23-9455-39efdd744acb.png',
    } as any,
  });

  const category6 = await prisma.category.create({
    data: {
      id: '93986d6c-b4b7-4d80-b8e8-a48bb8d421b5',
      title: 'Weapons',
      image: 'images/af072638-82b2-4dfd-913d-5a26f5f64ec1.png',
    } as any,
  });

  console.log(`✅ Created ${6} categories`);

  // Create Auctions (50+ auctions with varied titles)
  console.log('🔨 Creating auctions...');
  const auctionTitles = [
    // Watches category
    'Vintage Rolex Submariner',
    'Classic Omega Speedmaster',
    'Luxury Patek Philippe',
    'Antique Pocket Watch',
    'Modern Smart Watch',
    'Vintage Cartier Timepiece',
    'Rare Swiss Watch',
    'Designer Chronograph',
    'Classic Timepiece Collection',
    'Premium Watch Set',
    'Luxury Wristwatch',
    'Vintage Watch Collection',
    'Modern Timepiece',
    'Classic Analog Watch',
    'Premium Watch Display',

    // Furniture category
    'Antique Oak Dining Table',
    'Modern Leather Sofa',
    'Vintage Desk Set',
    'Designer Coffee Table',
    'Classic Bookshelf',
    'Modern Office Chair',
    'Antique Chair Collection',
    'Luxury Bed Frame',
    'Vintage Wardrobe',
    'Designer Sideboard',
    'Classic Dining Set',
    'Modern Console Table',
    'Antique Cabinet',
    'Luxury Armchair',
    'Vintage Chest',

    // Keep category
    'Rare Collectible Item',
    'Vintage Keepsake Box',
    'Antique Storage Chest',
    'Classic Memory Box',
    'Premium Collection Item',
    'Vintage Treasure Box',
    'Rare Keepsake',
    'Antique Storage Unit',
    'Classic Collection Piece',
    'Premium Keepsake',
    'Vintage Collectible',
    'Rare Storage Box',
    'Antique Memory Chest',
    'Classic Keepsake Item',
    'Premium Collection Box',

    // Statues category
    'Ancient Marble Statue',
    'Classic Bronze Sculpture',
    'Vintage Stone Statue',
    'Modern Art Sculpture',
    'Antique Garden Statue',
    'Classic Figurine',
    'Vintage Statue Collection',
    'Premium Sculpture',
    'Ancient Artifact Statue',
    'Classic Marble Figure',
    'Vintage Bronze Statue',
    'Modern Statue Display',
    'Antique Stone Figure',
    'Classic Garden Sculpture',
    'Premium Art Statue',

    // Skulls category
    'Vintage Skull Replica',
    'Ancient Skull Artifact',
    'Classic Skull Display',
    'Modern Skull Sculpture',
    'Antique Skull Collection',
    'Premium Skull Replica',
    'Vintage Skull Art',
    'Classic Skull Artifact',
    'Ancient Skull Display',
    'Modern Skull Collection',
    'Antique Skull Sculpture',
    'Premium Skull Art',
    'Vintage Skull Figure',
    'Classic Skull Replica',
    'Ancient Skull Collection',

    // Weapons category
    'Medieval Sword Collection',
    'Vintage Dagger Set',
    'Ancient Weapon Display',
    'Classic Sword Replica',
    'Antique Weapon Collection',
    'Premium Sword Set',
    'Vintage Dagger Collection',
    'Classic Weapon Display',
    'Ancient Sword Replica',
    'Modern Weapon Collection',
    'Antique Dagger Set',
    'Premium Weapon Display',
    'Vintage Sword Artifact',
    'Classic Dagger Collection',
    'Ancient Weapon Replica',
  ];

  const categories = [
    category1,
    category2,
    category3,
    category4,
    category5,
    category6,
  ];
  const users = [user1, user2];
  const imagePath = 'images/bfbce542-d2e3-4b57-aa8c-b643b36c3472.png';

  // Create 50+ auctions distributed across categories and users
  const auctions: Array<{
    title: string;
    image: string;
    categoryID: string;
    userId: string;
  }> = [];

  for (let i = 0; i < auctionTitles.length; i++) {
    const categoryIndex = i % categories.length;
    const userIndex = i % users.length;

    auctions.push({
      title: auctionTitles[i],
      image: imagePath,
      categoryID: categories[categoryIndex].id,
      userId: users[userIndex].id,
    });
  }

  // Add more auctions to reach 50+
  const additionalTitles = [
    'Rare Vintage Item',
    'Premium Collectible',
    'Classic Antique',
    'Modern Artifact',
    'Vintage Treasure',
    'Ancient Relic',
    'Premium Artifact',
    'Classic Collectible',
    'Rare Antique',
    'Vintage Artifact',
    'Modern Collectible',
    'Premium Vintage',
    'Classic Relic',
    'Ancient Collectible',
    'Rare Artifact',
    'Vintage Premium',
    'Classic Artifact',
    'Modern Vintage',
    'Premium Relic',
    'Antique Collectible',
  ];

  for (let i = 0; i < additionalTitles.length; i++) {
    const categoryIndex = (auctionTitles.length + i) % categories.length;
    const userIndex = (auctionTitles.length + i) % users.length;

    auctions.push({
      title: additionalTitles[i],
      image: imagePath,
      categoryID: categories[categoryIndex].id,
      userId: users[userIndex].id,
    });
  }

  // Create all auctions
  for (const auction of auctions) {
    await prisma.auction.create({
      data: auction as any,
    });
  }

  console.log(`✅ Created ${auctions.length} auctions`);

  console.log('✨ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${2}`);
  console.log(`   - Categories: ${6}`);
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
