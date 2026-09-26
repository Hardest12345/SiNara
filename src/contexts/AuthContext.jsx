import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch profile dari tabel profiles ──────────────────────────────
  const fetchProfile = async (sessionUser) => {
    if (!sessionUser) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionUser.id)
      .maybeSingle();

    if (error) {
      console.error('Gagal fetch profile:', error);
    }

    const meta = sessionUser.user_metadata || {};
    return {
      id: sessionUser.id,
      full_name: data?.full_name || meta.full_name || 'User',
      role: data?.role || meta.role || 'siswa',
      progress_level: data?.progress_level || null,
      ...data,
    };
  };

  // ── Init session ───────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    // Cek session saat mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      if (session?.user) {
        const p = await fetchProfile(session.user);
        if (mounted) setProfile(p);
      }
      if (mounted) setLoading(false);
    });

    // Listen perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        setSession(session);
        if (session?.user) {
          const p = await fetchProfile(session.user);
          if (mounted) setProfile(p);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── Register ───────────────────────────────────────────────────────
  const register = async ({ email, password, fullName, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
    if (error) throw error;
    return data;
  };

  // ── Login ──────────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // ── Logout ─────────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  };

  // ── Update progress (dipakai ZoneLiterasi) ─────────────────────────
  const updateProgress = async (newProgress) => {
    if (!profile) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ progress_level: newProgress, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
      .select()
      .single();

    if (error) {
      console.error('Gagal update progress:', error);
      return;
    }
    setProfile(data);
  };

  const value = {
    session,
    user: session?.user || null,
    profile,
    loading,
    register,
    login,
    logout,
    updateProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}