import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { action, email, password, fullName, role, displayName, avatar } = req.body;

    if (action === 'signup') {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'Email déjà utilisé.' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          role: role === 'creator' ? 'CREATOR' : 'VIEWER',
          creator: role === 'creator' ? {
            create: {
              displayName: displayName || fullName,
              avatar: avatar || null,
            }
          } : undefined,
        },
        include: { creator: true },
      });
      return res.status(201).json({ user });
    }
    if (action === 'signin') {
      const user = await prisma.user.findUnique({ where: { email }, include: { creator: true } });
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }
      return res.status(200).json({ user });
    }
    return res.status(400).json({ error: 'Action inconnue.' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
}
