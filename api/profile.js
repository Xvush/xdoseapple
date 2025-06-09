const prisma = require('./lib/prisma.js');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { id, videos } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    if (videos !== undefined) {
      // GET /api/profile?videos&id=...
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          include: { videos: { orderBy: { createdAt: 'desc' } } },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.status(200).json({ videos: user.videos });
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    } else {
      // GET /api/profile?id=...
      try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.status(200).json(user);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    }
  }

  if (req.method === 'PUT') {
    // PUT /api/profile
    const { id, displayName, bio, avatar, cover } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { displayName, bio, avatar, cover },
      });
      return res.status(200).json({ user });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
