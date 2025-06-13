import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId' });
  }

  try {
    console.log('Fetching video data for ID:', videoId);
    
    // Récupérer les informations de la vidéo depuis la base de données
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { muxPlaybackId: true }
    });

    if (!video || !video.muxPlaybackId) {
      console.error('Video not found:', videoId);
      return res.status(404).json({ error: 'Video not found' });
    }

    // Construire l'URL Mux avec le bon format HLS
    const muxUrl = `https://stream.mux.com/${video.muxPlaybackId}/master.m3u8`;
    console.log('Fetching from Mux URL:', muxUrl);

    // Faire la requête vers Mux
    const response = await fetch(muxUrl, {
      headers: {
        'Accept': '*/*',
        'Origin': 'https://xdoseapple.vercel.app'
      }
    });

    if (!response.ok) {
      console.error('Mux API error:', {
        status: response.status,
        statusText: response.statusText,
        url: muxUrl
      });
      throw new Error(`Mux API responded with status: ${response.status}`);
    }

    // Lire le contenu de la réponse
    const content = await response.text();

    // Remplacer les URLs relatives par des URLs absolues
    const modifiedContent = content.replace(
      /([^"]*\.m3u8|[^"]*\.ts)/g,
      (match) => {
        if (match.startsWith('http')) return match;
        return `https://stream.mux.com/${video.muxPlaybackId}/${match}`;
      }
    );

    // Configurer les en-têtes de réponse
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Envoyer le contenu modifié
    res.status(200).send(modifiedContent);

  } catch (error) {
    console.error('Error in video proxy:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  }
} 