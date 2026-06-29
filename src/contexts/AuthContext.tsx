import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { storage, type User } from "@/lib/storage";

type AuthContextType = {
  user: User | null;
  isSetupComplete: boolean;
  loading: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  completeSetup: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isSetupComplete: false,
  loading: true,
  signIn: () => {},
  signOut: () => {},
  completeSetup: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(storage.getUser());
    setIsSetupComplete(storage.isSetupComplete());
    setLoading(false);
  }, []);

  const signIn = (u: User) => {
    storage.setUser(u);
    setUser(u);
    // Re-read setup flag each time in case it was set in a previous session
    setIsSetupComplete(storage.isSetupComplete());
  };

  const completeSetup = () => {
    setIsSetupComplete(true);
  };

  const signOut = () => {
    storage.clearAll();
    setUser(null);
    setIsSetupComplete(false);
  };

  return (
    <AuthContext.Provider value={{ user, isSetupComplete, loading, signIn, signOut, completeSetup }}>
      {children}
    </AuthContext.Provider>
  );
}
