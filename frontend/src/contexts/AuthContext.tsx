import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

/** Explicit list of Google OAuth emails granted Admin privileges */
/** Explicit list of Google OAuth emails granted Admin privileges */
export const ADMIN_EMAILS: string[] = [
  'venkatmukala9@gmail.com',
  'venkat.mukala9@gmail.com',
  'prepsunite@gmail.com',
  'veen1kat@gmail.com',
  'chandu@gmail.com',
];

export function isAllowedAdminEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  if (normalized.endsWith('@prepunite.com') && normalized.includes('admin')) return true;
  return ADMIN_EMAILS.some(a => a.toLowerCase().trim() === normalized);
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
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithGithub: () => Promise<{ error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null; data?: any }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null; data?: any }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  loginAsUser: (name?: string, email?: string) => void;
  loginAsAdmin: (password?: string) => boolean;
  switchRole: (newRole: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Guest Explorer',
  email: 'guest@prepunite.com',
  role: 'GUEST',
};

const STUDENT_USER: UserProfile = {
  id: 'student-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@student.edu',
  role: 'USER',
  targetCompany: 'TCS NQT 2026',
};

const ADMIN_USER: UserProfile = {
  id: 'admin-001',
  name: 'Super Admin',
  email: 'venkatmukala9@gmail.com',
  role: 'ADMIN',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('prepunite_role') as UserRole;
    return saved || 'GUEST';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('prepunite_role') as UserRole;
    if (saved === 'ADMIN') return ADMIN_USER;
    if (saved === 'USER') return STUDENT_USER;
    return GUEST_USER;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync Supabase Auth state dynamically (Google OAuth 2.0)
  useEffect(() => {
    let mounted = true;

    async function checkInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          const su = session.user;
          const userMeta = su.user_metadata || {};
          const email = su.email || userMeta.email || 'user@prepunite.com';
          const name = userMeta.full_name || userMeta.name || email.split('@')[0];
          const avatarUrl = userMeta.avatar_url || userMeta.picture;

          const isAdminEmail = isAllowedAdminEmail(email);
          const assignedRole: UserRole = isAdminEmail ? 'ADMIN' : 'USER';

          setUser({
            id: su.id,
            name,
            email,
            role: assignedRole,
            avatarUrl,
          });
          setRole(assignedRole);
          localStorage.setItem('prepunite_role', assignedRole);

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
        const email = su.email || userMeta.email || 'user@prepunite.com';
        const name = userMeta.full_name || userMeta.name || email.split('@')[0];
        const avatarUrl = userMeta.avatar_url || userMeta.picture;

        const isAdminEmail = isAllowedAdminEmail(email);
        const assignedRole: UserRole = isAdminEmail ? 'ADMIN' : 'USER';

        setUser({
          id: su.id,
          name,
          email,
          role: assignedRole,
          avatarUrl,
        });
        setRole(assignedRole);
        localStorage.setItem('prepunite_role', assignedRole);

        if (window.location.hash && window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(GUEST_USER);
        setRole('GUEST');
        localStorage.removeItem('prepunite_role');
      } else {
        // Fallback to localStorage state if Supabase session is non-session GUEST
        const savedRole = localStorage.getItem('prepunite_role') as UserRole;
        if (savedRole === 'ADMIN') {
          setRole('ADMIN');
          setUser(ADMIN_USER);
        } else if (savedRole === 'USER') {
          setRole('USER');
          setUser(STUDENT_USER);
        }
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
        console.warn('[signInWithGoogle] OAuth Notice:', error.message);
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      console.warn('[signInWithGoogle] OAuth Exception:', err);
      return { error: err.message || 'Failed to initiate Google Sign-In' };
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

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Failed to initiate GitHub Sign-In' };
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

  const loginAsUser = (name = 'Super Admin', email = 'venkatmukala9@gmail.com') => {
    const isAdminEmail = isAllowedAdminEmail(email);
    const assignedRole: UserRole = isAdminEmail ? 'ADMIN' : 'USER';
    const newUser: UserProfile = {
      id: isAdminEmail ? 'admin-001' : 'student-101',
      name: isAdminEmail ? 'Super Admin' : name,
      email,
      role: assignedRole,
      targetCompany: 'TCS NQT 2026',
    };
    setUser(newUser);
    setRole(assignedRole);
    localStorage.setItem('prepunite_role', assignedRole);
  };

  const loginAsAdmin = (password = 'admin123') => {
    if (password === 'admin123' || password === 'admin') {
      setUser(ADMIN_USER);
      setRole('ADMIN');
      localStorage.setItem('prepunite_role', 'ADMIN');
      return true;
    }
    return false;
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('prepunite_role', newRole);
    if (newRole === 'GUEST') setUser(GUEST_USER);
    if (newRole === 'USER') setUser(STUDENT_USER);
    if (newRole === 'ADMIN') setUser(ADMIN_USER);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setRole('GUEST');
    setUser(GUEST_USER);
    localStorage.removeItem('prepunite_role');
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
        loginAsAdmin,
        switchRole,
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
