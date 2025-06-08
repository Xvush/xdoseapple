// API route pour récupérer le user lié à un id de créateur
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
      include: { user: true },
    });
    if (!creator || !creator.user) {
      res.status(404).json({ error: 'Creator not found' });
      return;
    }
    // On renvoie le même format que /api/profile-id
    res.status(200).json({
      id: creator.user.id,
      name: creator.displayName || creator.user.email,
      username: creator.user.email,
      avatar: creator.avatar || '/images/profile.png',
      coverImage: '/images/profile.png',
      bio: creator.bio || '',
      followers: creator.followers || 0,
      following: creator.following || 0,
      posts: creator.posts || 0,
      subscriptionPrice: creator.subscriptionPrice || '',
      isVerified: creator.isVerified || false,
      role: 'creator',
      creator: { id: creator.id },
    });
  } catch (error) {
    console.error('API /api/creator-id error:', error);
    res.status(500).json({ error: 'Server error', details: error?.message });
  }
};
