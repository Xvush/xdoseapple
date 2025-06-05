import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { action, email, password, fullName, role, displayName, avatar } = req.body;
    if (action === 'signup') {
      // Vérifier unicité email
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
  }
  res.status(405).json({ error: 'Méthode non autorisée.' });
}
