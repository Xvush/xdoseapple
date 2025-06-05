import { useState, useEffect, createContext, useContext } from 'react';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'creator' | 'viewer', displayName?: string, avatar?: string) => Promise<{ error: any }>; 
  signIn: (email: string, password: string) => Promise<{ error: any }>; 
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
