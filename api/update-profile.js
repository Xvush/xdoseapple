// API route: /api/update-profile.js
// Permet à un utilisateur (creator ou viewer) de mettre à jour son profil (avatar, cover, bio, displayName...)
const prisma = require('./lib/prisma');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }
  try {
    const { id, displayName, avatar, cover, bio } = req.body;
    if (!id) {
      res.status(400).json({ error: 'User id requis' });
      return;
    }
    const user = await prisma.user.update({
      where: { id },
      data: {
        displayName,
        avatar,
        cover,
        bio,
      },
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error('API /api/update-profile error:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error?.message });
  }
};
