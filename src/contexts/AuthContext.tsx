import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUserMetadata: (data: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  updateUserMetadata: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to get mock user with persistence
  const getMockUser = () => {
    const stored = localStorage.getItem('vincere_mock_user');
    const metadata = stored ? JSON.parse(stored) : { full_name: 'Admin Developer' };
    
    return {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'assasinghost910@gmail.com',
      user_metadata: metadata,
      aud: 'authenticated',
      app_metadata: {},
      created_at: new Date().toISOString(),
    } as User;
  };

  // Helper to update user locally (useful for dev/mock)
  const updateUserMetadata = (metadata: any) => {
    if (user) {
      const newMetadata = { ...user.user_metadata, ...metadata };
      if (window.location.hostname === 'localhost' && user.id === 'dev-admin-user') {
        localStorage.setItem('vincere_mock_user', JSON.stringify(newMetadata));
      }
      setUser({
        ...user,
        user_metadata: newMetadata
      });
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session && window.location.hostname === 'localhost') {
          setUser(getMockUser());
          setLoading(false);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && window.location.hostname === 'localhost') {
        setUser(getMockUser());
        setLoading(false);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, updateUserMetadata }}>
      {children}
    </AuthContext.Provider>
  );
};
