import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { dataStore } from '@/services/dataStore';
import { progressService } from '@/services/progress.service';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

export function formatDisplayNameFromEmail(email: string, rawName?: string): string {
  if (rawName && rawName.trim() && !['User', 'Demo Student', 'Student', 'GUEST'].includes(rawName.trim())) {
    return rawName.trim();
  }
  if (!email) return 'Student Explorer';
  const prefix = email.split('@')[0];
  if (!prefix) return 'Student Explorer';

  const cleaned = prefix.replace(/[._-]/g, ' ').replace(/\d+/g, ' ').trim();
  if (cleaned.length > 1) {
    return cleaned
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  targetCompany?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithGithub: () => Promise<{ error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null; data?: any }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null; data?: any }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Guest Explorer',
  email: 'guest@prepunite.com',
  role: 'GUEST',
};

// Synchronously read cached user from localStorage on initialization to eliminate split-second flash
const getInitialUser = (): UserProfile | null => {
  try {
    const email = localStorage.getItem('prepunite_user_email');
    const name = localStorage.getItem('prepunite_user_name');
    const role = (localStorage.getItem('prepunite_role') as UserRole) || 'USER';
    const avatarUrl = localStorage.getItem('prepunite_user_avatar') || undefined;

    if (email && email !== 'guest@prepunite.com') {
      return {
        id: email,
        name: name || formatDisplayNameFromEmail(email, ''),
        email,
        role,
        avatarUrl,
      };
    }
  } catch (e) {
    console.warn('Failed to read cached user profile:', e);
  }
  return GUEST_USER;
};

const getInitialRole = (): UserRole => {
  try {
    const role = localStorage.getItem('prepunite_role') as UserRole;
    if (role) return role;
  } catch {}
  return 'GUEST';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(getInitialRole);
  const [user, setUser] = useState<UserProfile | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to persist profile state from Supabase database
  const applyUserProfile = (
    email: string,
    nameInput: string,
    avatarUrl?: string,
    isConfirmedAdmin: boolean = false
  ) => {
    const assignedRole: UserRole = isConfirmedAdmin ? 'ADMIN' : 'USER';
    const name = formatDisplayNameFromEmail(email, nameInput);

    const newProfile: UserProfile = {
      id: email,
      name,
      email,
      role: assignedRole,
      avatarUrl,
    };

    setUser(newProfile);
    setRole(assignedRole);
    localStorage.setItem('prepunite_role', assignedRole);
    localStorage.setItem('prepunite_user_email', email);
    localStorage.setItem('prepunite_user_name', name);
    if (avatarUrl) {
      localStorage.setItem('prepunite_user_avatar', avatarUrl);
    }
    return newProfile;
  };

  // Standard Database `public.profiles` Table Sync — role is strictly driven by the database table
  const syncProfileWithSupabase = async (
    userId: string,
    email: string,
    rawName: string,
    rawAvatar?: string,
    appRole?: string
  ) => {
    try {
      const { data: dbProfile, error } = await supabase
        .from('profiles')
        .select('role, name, avatar_url')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[syncProfileWithSupabase] Profile lookup notice:', error.message);
      }

      // Check database role column as source of truth
      const dbRole = dbProfile?.role ? String(dbProfile.role).toLowerCase() : undefined;
      const isDbAdmin = dbRole === 'admin' || appRole === 'admin';

      const finalName = dbProfile?.name || rawName;
      const finalAvatar = dbProfile?.avatar_url || rawAvatar;

      if (!dbProfile && userId && email) {
        try {
          await supabase.from('profiles').upsert({
            id: userId,
            email: email,
            name: finalName || email.split('@')[0],
            role: isDbAdmin ? 'admin' : 'user',
            avatar_url: finalAvatar,
          });
        } catch (uErr) {
          console.warn('[syncProfileWithSupabase] Profile creation notice:', uErr);
        }
      }

      applyUserProfile(email, finalName, finalAvatar, isDbAdmin);
    } catch (err) {
      console.warn('[syncProfileWithSupabase] Fallback profile resolution:', err);
      applyUserProfile(email, rawName, rawAvatar, false);
    }
  };

  // Sync Supabase Auth state dynamically (Google OAuth 2.0)
  useEffect(() => {
    let mounted = true;

    async function checkInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          const su = session.user;
          const userMeta = su.user_metadata || {};
          const appMeta = su.app_metadata || {};
          const email = su.email || userMeta.email || '';
          const name = userMeta.full_name || userMeta.name || (email ? email.split('@')[0] : 'User');
          const avatarUrl = userMeta.avatar_url || userMeta.picture;
          const appRole = appMeta.role;

          if (email) {
            await syncProfileWithSupabase(su.id, email, name, avatarUrl, appRole);
            dataStore.hydrateBookmarksFromSupabase(userMeta);
            progressService.fetchAndSyncFromSupabase(email);
            progressService.migrateGuestProgress(email);
          }

          if (window.location.search.includes('code=') || (window.location.hash && window.location.hash.includes('access_token'))) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      } catch (err) {
        console.warn('[AuthProvider] Supabase session check notice:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    checkInitialSession();

    // Listen to live Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const su = session.user;
        const userMeta = su.user_metadata || {};
        const appMeta = su.app_metadata || {};
        const email = su.email || userMeta.email || '';
        const name = userMeta.full_name || userMeta.name || (email ? email.split('@')[0] : 'User');
        const avatarUrl = userMeta.avatar_url || userMeta.picture;
        const appRole = appMeta.role;

        if (email) {
          await syncProfileWithSupabase(su.id, email, name, avatarUrl, appRole);
          dataStore.hydrateBookmarksFromSupabase(userMeta);
          progressService.fetchAndSyncFromSupabase(email);
          progressService.migrateGuestProgress(email);
        }

        if (window.location.search.includes('code=') || (window.location.hash && window.location.hash.includes('access_token'))) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(GUEST_USER);
        setRole('GUEST');
        localStorage.removeItem('prepunite_role');
        localStorage.removeItem('prepunite_user_email');
        localStorage.removeItem('prepunite_user_name');
        localStorage.removeItem('prepunite_user_avatar');
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // 1-Click Google OAuth 2.0 Sign In Handler
  const signInWithGoogle = async () => {
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/profile`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        console.warn('[signInWithGoogle] OAuth notice:', error.message);
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      console.warn('[signInWithGoogle] Error:', err);
      return { error: err.message || 'Failed to initiate Google OAuth' };
    }
  };

  // 1-Click GitHub OAuth 2.0 Sign In Handler
  const signInWithGithub = async () => {
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${origin}/profile`,
        },
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Failed to initiate GitHub OAuth' };
    }
  };

  // Email & Password Sign In
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data?.user?.email) {
        const name = data.user.user_metadata?.full_name || email.split('@')[0];
        applyUserProfile(email, name);
      }
      return { error: null, data };
    } catch (err: any) {
      return { error: err.message || 'Invalid login credentials' };
    }
  };

  // Email & Password Sign Up
  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
          },
          emailRedirectTo: `${origin}/profile`,
        },
      });
      if (error) throw error;
      return { error: null, data };
    } catch (err: any) {
      return { error: err.message || 'Sign up failed' };
    }
  };

  // Password Reset Email
  const resetPassword = async (email: string) => {
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/profile`,
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Password reset request failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[logout] Notice:', err);
    } finally {
      setUser(GUEST_USER);
      setRole('GUEST');
      localStorage.removeItem('prepunite_role');
      localStorage.removeItem('prepunite_user_email');
      localStorage.removeItem('prepunite_user_name');
      localStorage.removeItem('prepunite_user_avatar');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: role !== 'GUEST',
        isAdmin: role === 'ADMIN',
        isGuest: role === 'GUEST',
        isLoading,
        signInWithGoogle,
        signInWithGithub,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
