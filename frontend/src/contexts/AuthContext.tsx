import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

/** Explicit list of Google OAuth emails granted Admin privileges */
export const ADMIN_EMAILS: string[] = [
  'venkatmukala9@gmail.com',
  'prepsunite@gmail.com',
  'veen1kat@gmail.com',
];

export function isAllowedAdminEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
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
  email: 'admin@prepunite.com',
  role: 'ADMIN',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('prepunite_role') as UserRole) || 'GUEST';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('prepunite_role') as UserRole;
    if (saved === 'USER') return STUDENT_USER;
    if (saved === 'ADMIN') return ADMIN_USER;
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
        }
      } catch (err) {
        console.warn('[AuthProvider] Supabase session check notice:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    checkInitialSession();

    // Listen to live Auth State Changes (Google 1-click Sign In / Sign Out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
      } else {
        const savedRole = localStorage.getItem('prepunite_role') as UserRole;
        if (!savedRole || savedRole === 'GUEST') {
          setUser(GUEST_USER);
          setRole('GUEST');
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
          redirectTo: `${origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        console.warn('[signInWithGoogle] Notice:', error.message);
        // Fallback for offline / local demo testing without live Google Client ID
        loginAsUser('Google Student User', 'student@gmail.com');
        return { error: null };
      }
      return { error: null };
    } catch (err: any) {
      console.warn('[signInWithGoogle] Fallback activated:', err);
      loginAsUser('Google Student User', 'student@gmail.com');
      return { error: null };
    }
  };

  const loginAsUser = (name = 'Alex Rivera', email = 'alex.rivera@student.edu') => {
    const newUser: UserProfile = {
      ...STUDENT_USER,
      name,
      email,
    };
    setUser(newUser);
    setRole('USER');
    localStorage.setItem('prepunite_role', 'USER');
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
