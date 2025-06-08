// api/mux-webhook.js
const crypto = require('crypto');
const { PrismaClient } = require('../api/lib/prisma.js');
const prisma = new PrismaClient();

// Pour la vérification du webhook secret Mux (à mettre dans .env)
const MUX_WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  // Vérification de la signature Mux (sécurité)
  const signature = req.headers['mux-signature'];
  if (!signature || !MUX_WEBHOOK_SECRET) {
    res.status(401).json({ error: 'Signature ou secret manquant' });
    return;
  }

  // Mux envoie la signature sous forme : t=timestamp,v1=signature
  const [timestampPart, signaturePart] = signature.split(',');
  const timestamp = timestampPart.split('=')[1];
  const v1 = signaturePart.split('=')[1];
  const payload = req.rawBody || JSON.stringify(req.body);
  const prehash = `${timestamp}.${payload}`;
  const expected = crypto.createHmac('sha256', MUX_WEBHOOK_SECRET).update(prehash).digest('hex');

  if (expected !== v1) {
    res.status(401).json({ error: 'Signature invalide' });
    return;
  }

  // Ici tu peux traiter les events Mux (upload terminé, asset prêt, etc.)
  const event = req.body;
  console.log('MUX EVENT:', event.type, event);

  // Gestion des events Mux
  if (event.type === 'video.asset.ready') {
    const asset = event.data;
    // On récupère le creatorId depuis asset.passthrough (envoyé lors de l'upload)
    const creatorId = asset.passthrough;
    if (!creatorId) {
      console.error('Passthrough (creatorId) manquant dans l’event Mux');
      res.status(400).json({ error: 'creatorId manquant dans passthrough' });
      return;
    }
    await prisma.video.create({
      data: {
        creatorId,
        title: 'Vidéo sans titre', // À améliorer côté frontend
        muxAssetId: asset.id,
        muxPlaybackId: asset.playback_ids[0]?.id || '',
        status: 'ready',
        duration: asset.duration ? Math.round(asset.duration) : null,
        thumbnailUrl: asset.static_renditions?.status === 'ready' ? asset.static_renditions.gif : null,
      }
    });
  }

  res.status(200).json({ received: true });
};
