import { useState, useEffect, createContext, useContext } from 'react';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'creator' | 'viewer', displayName?: string, avatar?: string) => Promise<{ error: any }>; 
  signIn: (email: string, password: string) => Promise<{ error: any }>; 
  signOut: () => Promise<void>;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('xdose-user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setSession({ user: parsed });
      } catch {}
    }
  }, []);

  // Inscription via API
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
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', email, password, fullName, role, displayName, avatar })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return { error: data.error };
      }
      setUser(data.user);
      setSession({ user: data.user });
      localStorage.setItem('xdose-user', JSON.stringify(data.user));
      setLoading(false);
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  // Connexion via API
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signin', email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        return { error: data.error };
      }
      setUser(data.user);
      setSession({ user: data.user });
      localStorage.setItem('xdose-user', JSON.stringify(data.user));
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
    localStorage.removeItem('xdose-user');
  };

  // Session expiration (2 hours)
  useEffect(() => {
    if (!user) return;
    const EXPIRATION_MS = 2 * 60 * 60 * 1000; // 2 hours
    const now = Date.now();
    let sessionStart = now;
    try {
      const stored = localStorage.getItem('xdose-session-start');
      if (stored) sessionStart = parseInt(stored, 10);
      else localStorage.setItem('xdose-session-start', String(now));
    } catch {}
    const timeout = setTimeout(() => {
      setUser(null);
      setSession(null);
      localStorage.removeItem('xdose-user');
      localStorage.removeItem('xdose-session-start');
      window.location.href = '/auth';
    }, sessionStart + EXPIRATION_MS - now);
    // Reset session start on activity
    const resetSession = () => {
      localStorage.setItem('xdose-session-start', String(Date.now()));
    };
    window.addEventListener('click', resetSession);
    window.addEventListener('keydown', resetSession);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('click', resetSession);
      window.removeEventListener('keydown', resetSession);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, setUser }}>
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
