'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { ProfileRow, DbRole } from '@/lib/supabase/types';
import { clearTempRole } from '@/lib/roles';

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
  role: 'author',
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

  const resolveRole = (): DbRole => {
    if (profile?.role) return profile.role;
    const meta = user?.user_metadata?.role;
    if (meta === 'admin' || meta === 'editor' || meta === 'author') return meta;
    return 'author';
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
          await loadProfile(next.user.id);
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
    clearTempRole();
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
        role: resolveRole(),
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
