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
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({
      id: user.id,
      name: user.displayName || user.email,
      username: user.email,
      avatar: user.avatar || '/images/profile.png',
      coverImage: user.cover || '/images/profile.png',
      bio: user.bio || '',
      followers: user.followers || 0,
      following: user.following || 0,
      posts: user.posts || 0,
      subscriptionPrice: user.subscriptionPrice || '',
      isVerified: user.isVerified || false,
      role: user.role === 'CREATOR' ? 'creator' : 'viewer',
    });
  } catch (error) {
    console.error('API /api/profile-id error:', error);
    res.status(500).json({ error: 'Server error', details: error?.message });
  }
};
