// /api/feed.js
const prisma = require('./lib/prisma.js');

/**
 * GET /api/feed
 * Returns a paginated feed of posts/videos with creator info, ordered by newest first.
 * Query params: ?cursor=<videoId>&limit=<number>
 */
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cursor, limit } = req.query;
  const take = Math.min(parseInt(limit) || 10, 30); // max 30 per page

  try {
    const where = {};
    const orderBy = { createdAt: 'desc' };
    const videos = await prisma.video.findMany({
      where,
      orderBy,
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
            isVerified: true,
            followers: true,
            subscriptionPrice: true,
          },
        },
      },
    });

    // Format posts for the frontend
    const posts = videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      muxPlaybackId: video.muxPlaybackId,
      createdAt: video.createdAt,
      duration: video.duration,
      tags: video.tags,
      user: video.user,
      // Add more fields as needed
    }));

    return res.status(200).json({ posts });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
