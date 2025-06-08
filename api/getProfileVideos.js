// API route pour récupérer les vidéos d'un créateur via ?id=...
let prisma;
try {
  prisma = require('./lib/prisma.js');
} catch (e) {
  console.error('Failed to require prisma:', e);
  // prisma will remain undefined
}

module.exports = async (req, res) => {
  if (!prisma) {
    console.error('Prisma client is not available. Check server logs for require error.');
    res.status(503).json({ error: 'Service temporarily unavailable - Prisma client failed to initialize.' });
    return;
  }

  try {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'Missing creator id' });
      return;
    }
    const creator = await prisma.creator.findUnique({
      where: { id },
      include: { videos: { orderBy: { createdAt: 'desc' } } }
    });
    if (!creator) {
      res.status(404).json({ error: 'Creator not found in database' }); // Clarified error
      return;
    }
    res.status(200).json({ videos: creator.videos });
  } catch (e) {
    console.error('[API] Error fetching videos (runtime):', e);
    // Ensure a JSON response for runtime errors too
    res.status(500).json({ error: e.message || 'Internal server error during video fetch.' });
  }
};
