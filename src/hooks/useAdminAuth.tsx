import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  userId: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

  useEffect(() => {
    let mounted = true;
    let resolved = false;

    const resolve = () => {
      if (!resolved && mounted) {
        resolved = true;
        setIsLoading(false);
      }
    };

    // Safety timeout — never stay loading forever
    const timeout = setTimeout(resolve, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        const admin = await checkAdmin(session.user.id);
        if (mounted) setIsAdmin(admin);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserId(null);
      }
      resolve();
    });

    // Also try getSession as backup
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        const admin = await checkAdmin(session.user.id);
        if (mounted) setIsAdmin(admin);
      }
      resolve();
    }).catch(() => {
      resolve();
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [checkAdmin]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

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
