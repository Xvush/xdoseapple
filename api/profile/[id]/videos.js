// /api/profile/[id]/videos.js
const prisma = require('../../lib/prisma.js');

module.exports = async (req, res) => {
  console.log('[API] /api/profile/[id]/videos.js called', req.query);
  const { id } = req.query;
  if (!id) {
    console.error('[API] Missing creator id');
    res.status(400).json({ error: 'Missing creator id' });
    return;
  }
  try {
    const creator = await prisma.creator.findUnique({
      where: { id },
      include: { videos: { orderBy: { createdAt: 'desc' } } }
    });
    if (!creator) {
      console.error('[API] Creator not found', id);
      res.status(404).json({ error: 'Creator not found' });
      return;
    }
    console.log('[API] Found videos:', creator.videos.length);
    res.status(200).json({ videos: creator.videos });
  } catch (e) {
    console.error('[API] Error fetching videos:', e);
    res.status(500).json({ error: e.message });
  }
};
