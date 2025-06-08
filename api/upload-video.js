// api/upload-video.js
const Mux = require('@mux/mux-node');

const mux = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  try {
    const { creatorId } = req.body;
    if (!creatorId) {
      res.status(400).json({ error: 'creatorId requis' });
      return;
    }
    // 1. Crée une URL d'upload direct Mux (signée, sécurisée)
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: 'public',
        passthrough: creatorId, // On passe le creatorId à Mux
      },
      cors_origin: '*',
    });
    // 2. Retourne l'URL d'upload à utiliser côté client
    res.status(200).json({ uploadUrl: upload.url, uploadId: upload.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
