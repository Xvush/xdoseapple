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

  try {
    const { cursor, limit } = req.query;
    const take = Math.min(parseInt(limit) || 5, 10); // max 10 items par requête
    const orderBy = { createdAt: 'desc' };
    const where = {}; // Vous pouvez ajouter des filtres ici si nécessaire

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
            avatar: true
          }
        }
      }
    });

    // Format posts for the frontend
    const posts = videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description || '',
      thumbnailUrl: video.thumbnailUrl,
      muxPlaybackId: video.muxPlaybackId,
      createdAt: video.createdAt,
      duration: video.duration || 0,
      tags: video.tags || [],
      user: video.user,
      likes: video.likes || 0,
      timeAgo: getTimeAgo(video.createdAt)
    }));

    return res.status(200).json({ posts });
    
  } catch (e) {
    console.error('Erreur dans /api/feed:', e);
    return res.status(500).json({ 
      error: 'Une erreur est survenue lors de la récupération du feed',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
};

// Helper function to format date as time ago
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + ' an' + (interval === 1 ? '' : 's');
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + ' mois';
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + ' jour' + (interval === 1 ? '' : 's');
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + 'h';
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + 'min';
  
  return 'à l\'instant';
}
