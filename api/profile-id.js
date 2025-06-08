// @ts-nocheck
const prisma = require('./lib/prisma');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const id = req.query.id;
  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Missing or invalid user id' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { creator: true },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({
      id: user.id,
      name: user.creator?.displayName || user.email,
      username: user.email,
      avatar: user.creator?.avatar || '/images/profile.png',
      coverImage: '/images/profile.png',
      bio: user.creator?.bio || '',
      followers: user.creator?.followers || 0,
      following: user.creator?.following || 0,
      posts: user.creator?.posts || 0,
      subscriptionPrice: user.creator?.subscriptionPrice || '',
      isVerified: user.creator?.isVerified || false,
      role: user.role === 'CREATOR' ? 'creator' : 'viewer',
    });
  } catch (error) {
    console.error('API /api/profile-id error:', error);
    res.status(500).json({ error: 'Server error', details: error?.message });
  }
};
