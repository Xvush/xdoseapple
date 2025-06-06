import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body || (await (async () => req.json && typeof req.json === 'function' ? await req.json() : {})());
    const { action } = body;

    if (!action) {
      res.status(400).json({ error: 'Action is required' });
      return;
    }

    await prisma.$connect();
    res.status(200).json({ message: 'API is working', action });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  } finally {
    await prisma.$disconnect();
  }
}
