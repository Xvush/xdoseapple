// api/video-edit.js
// PATCH /api/video-edit.js?id=VIDEO_ID
// Permet à un créateur d’éditer les métadonnées (titre, description, tags) d’une vidéo dont il est propriétaire

const prisma = require('./lib/prisma.js');
const { z } = require('zod');

// Schéma de validation Zod
const videoEditSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  tags: z.array(z.string().min(1).max(20)).max(5).optional(),
});

module.exports = async (req, res) => {
  if (req.method !== 'PATCH') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: 'ID vidéo requis' });
    return;
  }
  // Authentification simple par userId dans le body (à remplacer par vrai auth en prod)
  const { userId, title, description, tags } = req.body;
  if (!userId) {
    res.status(401).json({ error: 'Non authentifié' });
    return;
  }
  // Validation des champs
  const validation = videoEditSchema.safeParse({ title, description, tags });
  if (!validation.success) {
    res.status(400).json({ error: 'Champs invalides', details: validation.error.errors });
    return;
  }
  // Vérifie que la vidéo existe et appartient à l’utilisateur
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video || video.userId !== userId) {
    res.status(403).json({ error: 'Non autorisé' });
    return;
  }
  // Mise à jour des champs
  const updated = await prisma.video.update({
    where: { id },
    data: {
      title,
      description: description || null,
      tags: tags || [],
    },
  });
  res.status(200).json({ video: updated });
};
