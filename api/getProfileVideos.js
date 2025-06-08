// API route pour récupérer les vidéos d'un créateur via ?id=...
const prisma = require('./lib/prisma.js');

module.exports = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: 'Missing creator id' });
    return;
  }
  try {
    const creator = await prisma.creator.findUnique({
      where: { id },
      include: { videos: { orderBy: { createdAt: 'desc' } } }
    });
    if (!creator) {
      res.status(404).json({ error: 'Creator not found' });
      return;
    }
    res.status(200).json({ videos: creator.videos });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
