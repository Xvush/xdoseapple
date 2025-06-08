// API route pour récupérer les vidéos d'un utilisateur via ?id=...
let prisma;
try {
  prisma = require('./lib/prisma.js');
} catch (e) {
  console.error('Failed to require prisma:', e);
}

module.exports = async (req, res) => {
  if (!prisma) {
    res.status(503).json({ error: 'Service temporarily unavailable - Prisma client failed to initialize.' });
    return;
  }
  try {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'Missing user id' });
      return;
    }
    const videos = await prisma.video.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ videos });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Internal server error during video fetch.' });
  }
};
