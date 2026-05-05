import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/hooks/use-device-id";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDeviceVerified: boolean;
  signOut: () => Promise<void>;
  updateUserMetadata: (data: any) => void;
  refreshVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isDeviceVerified: true,
  signOut: async () => {},
  updateUserMetadata: () => {},
  refreshVerification: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeviceVerified, setIsDeviceVerified] = useState(true);

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

  const checkDeviceVerification = async (userId: string) => {
    try {
      if (!userId || userId === '00000000-0000-0000-0000-000000000000') {
        setIsDeviceVerified(true);
        return;
      }

      const deviceId = getDeviceId();
      const { data, error } = await supabase
        .from('vincere_known_devices')
        .select('id')
        .eq('user_id', userId)
        .eq('device_id', deviceId)
        .maybeSingle();

      if (error) {
        console.error("Error checking device verification:", error);
        setIsDeviceVerified(true); // Fallback to avoid lockout on error
        return;
      }

      if (!data) {
        setIsDeviceVerified(false);
        // Trigger email automatically on first detection of unknown device
        supabase.functions.invoke("vincere-2fa", {
          body: { 
            action: "send", 
            userId, 
            email: user?.email || session?.user?.email, 
            deviceId 
          },
        });
      } else {
        setIsDeviceVerified(true);
      }
    } catch (err) {
      console.error("Device verification failed, allowing access:", err);
      setIsDeviceVerified(true); // Never lock user out on error
    }
  };

  const refreshVerification = async () => {
    if (user) await checkDeviceVerification(user.id);
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
    // FAILSAFE: Force loading to false after 5 seconds no matter what
    const failsafe = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session && window.location.hostname === 'localhost') {
          setUser(getMockUser());
          setIsDeviceVerified(true);
          setLoading(false);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          if (session?.user) {
            checkDeviceVerification(session.user.id);
          } else {
            setIsDeviceVerified(true);
          }
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session && window.location.hostname === 'localhost') {
        setUser(getMockUser());
        setIsDeviceVerified(true);
        setLoading(false);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          checkDeviceVerification(session.user.id);
        } else {
          setIsDeviceVerified(true);
        }
      }
    }).catch((err) => {
      console.error("getSession failed:", err);
      setLoading(false); // Always stop loading even on error
    });

    return () => {
      clearTimeout(failsafe);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsDeviceVerified(true);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isDeviceVerified, signOut, updateUserMetadata, refreshVerification }}>
      {children}
    </AuthContext.Provider>
  );
};

