// @ts-nocheck
import prisma from '../../src/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid user id' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { creator: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Format the response for frontend consumption
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
    res.status(500).json({ error: 'Server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}
