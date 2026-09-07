'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { ProfileRow, DbRole } from '@/lib/supabase/types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: ProfileRow | null;
  role: DbRole;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  role: 'admin',
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        // Tables may not exist yet — still allow the shell to load
        console.warn('Profile load skipped:', error.message);
        setProfile(null);
        return;
      }
      setProfile((data as ProfileRow) ?? null);
    } catch (err) {
      console.warn('Profile load failed:', err);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    await loadProfile(user.id);
  };

  useEffect(() => {
    let mounted = true;

    // Never stay stuck on "Loading workspace…"
    const safety = window.setTimeout(() => {
      if (mounted) setLoading(false);
    }, 4000);

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) console.warn('getSession:', error.message);

        const next = data.session ?? null;
        setSession(next);
        setUser(next?.user ?? null);

        if (next?.user) {
          // Don't block UI on profile fetch
          void loadProfile(next.user.id);
        }
      } catch (err) {
        console.warn('Auth init failed:', err);
      } finally {
        if (mounted) setLoading(false);
        window.clearTimeout(safety);
      }
    };

    void init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      // Defer profile fetch to avoid auth lock deadlocks
      window.setTimeout(() => {
        if (!mounted) return;
        if (nextSession?.user) void loadProfile(nextSession.user.id);
        else setProfile(null);
      }, 0);
    });

    return () => {
      mounted = false;
      window.clearTimeout(safety);
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role: profile?.role ?? 'admin',
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
