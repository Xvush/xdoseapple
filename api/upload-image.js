// API route: /api/upload-image.js
// Permet d'uploader une image (avatar ou cover) dans /public/lovable-uploads/ et retourne l'URL
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }
  try {
    const match = req.headers['content-type']?.match(/image\/(\w+)/);
    if (!match) {
      res.status(400).json({ error: 'Type de fichier non supporté' });
      return;
    }
    const ext = match[1];
    const filename = `${crypto.randomUUID()}.${ext}`;
    const uploadPath = path.join(process.cwd(), 'public', 'lovable-uploads', filename);
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(uploadPath, buffer);
    res.status(200).json({ url: `/lovable-uploads/${filename}` });
  } catch (error) {
    console.error('API /api/upload-image error:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error?.message });
  }
};
