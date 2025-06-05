import { useState, useEffect, createContext, useContext } from 'react';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'creator' | 'viewer', displayName?: string, avatar?: string) => Promise<{ error: any }>; // Ajout displayName/avatar pour creator
  signIn: (email: string, password: string) => Promise<{ error: any }>; // Auth simple
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Inscription utilisateur (hash password, gestion role, profil creator si besoin)
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'creator' | 'viewer',
    displayName?: string,
    avatar?: string
  ) => {
    setLoading(true);
    try {
      // Vérifier unicité email
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        setLoading(false);
        return { error: { message: 'Email déjà utilisé.' } };
      }
      // Hash du mot de passe
      const hashed = await bcrypt.hash(password, 10);
      // Création user
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
      setUser(user);
      setSession({ user });
      setLoading(false);
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  // Connexion utilisateur (vérif email + hash)
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await prisma.user.findUnique({ where: { email }, include: { creator: true } });
      if (!user) {
        setLoading(false);
        return { error: { message: 'Utilisateur non trouvé.' } };
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        setLoading(false);
        return { error: { message: 'Mot de passe incorrect.' } };
      }
      setUser(user);
      setSession({ user });
      setLoading(false);
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  // Déconnexion (efface le user localement)
  const signOut = async () => {
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
