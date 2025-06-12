// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: 'hashedpassword',
      displayName: 'Jane Cooper',
      avatar: '/images/feed.png',
      isVerified: true,
      followers: 212,
      subscriptionPrice: '9.99',
    },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'ronald@example.com' },
    update: {},
    create: {
      email: 'ronald@example.com',
      password: 'hashedpassword',
      displayName: 'Ronald Richards',
      avatar: '/images/profile.png',
      isVerified: false,
      followers: 88,
      subscriptionPrice: '4.99',
    },
  });
  const user3 = await prisma.user.upsert({
    where: { email: 'leslie@example.com' },
    update: {},
    create: {
      email: 'leslie@example.com',
      password: 'hashedpassword',
      displayName: 'Leslie Alexander',
      avatar: '/images/profile.png',
      isVerified: true,
      followers: 120,
      subscriptionPrice: '7.99',
    },
  });

  // Create videos
  await prisma.video.createMany({
    data: [
      {
        userId: user1.id,
        title: 'Unboxing Apple Vision Pro',
        description: 'Découvrez le nouveau casque Apple Vision Pro en avant-première.',
        muxAssetId: 'asset1',
        muxPlaybackId: 'playback1',
        status: 'ready',
        duration: 300,
        thumbnailUrl: '/images/feed.png',
        tags: ['unboxing', 'apple', 'visionpro'],
      },
      {
        userId: user2.id,
        title: 'Vlog à San Francisco',
        description: 'Suivez-moi dans les rues de SF pour une journée de folie.',
        muxAssetId: 'asset2',
        muxPlaybackId: 'playback2',
        status: 'ready',
        duration: 180,
        thumbnailUrl: '/images/profile.png',
        tags: ['vlog', 'sf', 'travel'],
      },
      {
        userId: user3.id,
        title: 'Test du dernier iPhone',
        description: 'On teste toutes les nouveautés du nouvel iPhone.',
        muxAssetId: 'asset3',
        muxPlaybackId: 'playback3',
        status: 'ready',
        duration: 240,
        thumbnailUrl: '/images/profile.png',
        tags: ['test', 'iphone', 'apple'],
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
