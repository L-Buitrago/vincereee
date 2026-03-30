import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session && window.location.hostname === 'localhost') {
          // Keep mock user on localhost if no real session
          const mockUser: User = {
            id: 'dev-admin-user',
            email: 'assasinghost910@gmail.com',
            user_metadata: { full_name: 'Admin Developer' },
            aud: 'authenticated',
            app_metadata: {},
            created_at: new Date().toISOString(),
          };
          setUser(mockUser);
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
        const mockUser: User = {
          id: 'dev-admin-user',
          email: 'assasinghost910@gmail.com',
          user_metadata: { full_name: 'Admin Developer' },
          aud: 'authenticated',
          app_metadata: {},
          created_at: new Date().toISOString(),
        };
        setUser(mockUser);
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
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
