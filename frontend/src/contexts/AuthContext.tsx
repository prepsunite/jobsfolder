import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

/** Authorized Google OAuth emails granted full Admin privileges */
export const ADMIN_EMAILS: string[] = [
  'venkatmukala9@gmail.com',
  'venkat.mukala9@gmail.com',
  'prepsunite@gmail.com',
  'veen1kat@gmail.com',
];

export function isAllowedAdminEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  if (normalized.endsWith('@prepunite.com') && normalized.includes('admin')) return true;
  return ADMIN_EMAILS.some(a => a.toLowerCase().trim() === normalized);
}

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
  loginAsUser: (name?: string, email?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Guest Explorer',
  email: 'guest@prepunite.com',
  role: 'GUEST',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('prepunite_role') as UserRole;
    return savedRole || 'GUEST';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedEmail = localStorage.getItem('prepunite_user_email') || '';
    const savedRole = localStorage.getItem('prepunite_role') as UserRole;
    const savedName = localStorage.getItem('prepunite_user_name') || (savedEmail ? savedEmail.split('@')[0] : 'User');
    const savedAvatar = localStorage.getItem('prepunite_user_avatar') || undefined;

    if (savedRole && savedRole !== 'GUEST') {
      const isAdmin = isAllowedAdminEmail(savedEmail) || savedRole === 'ADMIN';
      const activeRole: UserRole = isAdmin ? 'ADMIN' : 'USER';
      return {
        id: savedEmail || 'user-id',
        name: savedName,
        email: savedEmail || 'user@prepunite.com',
        role: activeRole,
        avatarUrl: savedAvatar,
        targetCompany: 'TCS NQT 2026',
      };
    }
    return GUEST_USER;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to persist profile state
  const applyUserProfile = (email: string, nameInput: string, avatarUrl?: string) => {
    const isAdmin = isAllowedAdminEmail(email);
    const assignedRole: UserRole = isAdmin ? 'ADMIN' : 'USER';
    const name = formatDisplayNameFromEmail(email, nameInput);

    const newProfile: UserProfile = {
      id: email,
      name,
      email,
      role: assignedRole,
      avatarUrl,
      targetCompany: 'TCS NQT 2026',
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

  // Sync Supabase Auth state dynamically (Google OAuth 2.0)
  useEffect(() => {
    let mounted = true;

    async function checkInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          const su = session.user;
          const userMeta = su.user_metadata || {};
          const email = su.email || userMeta.email || '';
          const name = userMeta.full_name || userMeta.name || (email ? email.split('@')[0] : 'User');
          const avatarUrl = userMeta.avatar_url || userMeta.picture;

          if (email) {
            applyUserProfile(email, name, avatarUrl);
          }

          if (window.location.hash && window.location.hash.includes('access_token')) {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const su = session.user;
        const userMeta = su.user_metadata || {};
        const email = su.email || userMeta.email || '';
        const name = userMeta.full_name || userMeta.name || (email ? email.split('@')[0] : 'User');
        const avatarUrl = userMeta.avatar_url || userMeta.picture;

        if (email) {
          applyUserProfile(email, name, avatarUrl);
        }

        if (window.location.hash && window.location.hash.includes('access_token')) {
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

  const loginAsUser = (name = 'Demo Student', email = 'student@prepunite.com') => {
    applyUserProfile(email, name);
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
        loginAsUser,
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
