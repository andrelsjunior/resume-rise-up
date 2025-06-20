
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simular login
    if (email && password) {
      const mockUser = { id: '1', email };
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return {};
    }
    return { error: 'Invalid credentials' };
  };

  const signUp = async (email: string, password: string) => {
    // Simular cadastro
    if (email && password) {
      const mockUser = { id: '1', email };
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return {};
    }
    return { error: 'Invalid data' };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
