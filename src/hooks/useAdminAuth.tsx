import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  userId: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const checkAdmin = useCallback(async (uid: string): Promise<boolean> => {
    try {
      const { data } = await supabase.rpc('has_role', { _user_id: uid, _role: 'admin' });
      return !!data;
    } catch {
      return false;
    }
  }, []);

  // Single initialization: synchronous session resolution, defer admin check
  useEffect(() => {
    let mounted = true;

    // Hard safety net: never let the loading state hang the UI
    const loadingTimeout = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 3000);

    // Set up auth listener FIRST so we never miss an event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        // Defer Supabase RPC call to avoid deadlock inside the auth callback
        setTimeout(() => {
          checkAdmin(session.user.id).then((admin) => {
            if (mounted) setIsAdmin(admin);
          });
        }, 0);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserId(null);
      }
      setIsLoading(false);
    });

    // Then resolve the existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        checkAdmin(session.user.id).then((admin) => {
          if (mounted) setIsAdmin(admin);
        });
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserId(null);
      }
      setIsLoading(false);
    }).catch(() => {
      if (mounted) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserId(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [checkAdmin]);

  // signIn returns admin status directly so AdminLogin doesn't need a second RPC call
  const signIn = useCallback(async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      const admin = await checkAdmin(data.user.id);
      // State will be set by onAuthStateChange, but return result immediately
      return { success: true, isAdmin: admin };
    }
    return { success: true, isAdmin: false };
  }, [checkAdmin]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, isAdmin, userId, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
