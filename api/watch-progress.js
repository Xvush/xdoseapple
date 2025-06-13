import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId, videoId } = req.query;
    if (!userId || !videoId) {
      return res.status(400).json({ error: 'Missing userId or videoId' });
    }

    try {
      const progress = await prisma.watchProgress.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
      });

      return res.status(200).json({ progress: progress?.progress || 0 });
    } catch (e) {
      console.error('Error fetching watch progress:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    const { userId, videoId, progress } = req.body;
    if (!userId || !videoId || typeof progress !== 'number') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const watchProgress = await prisma.watchProgress.upsert({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
        update: {
          progress,
        },
        create: {
          userId,
          videoId,
          progress,
        },
      });

      return res.status(200).json({ watchProgress });
    } catch (e) {
      console.error('Error updating watch progress:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
} 