import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { dataStore } from '@/services/dataStore';
import { progressService } from '@/services/progress.service';
import { tpoService } from '@/services/tpo.service';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN' | 'TPO_ADMIN';

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
  isTpoAdmin?: boolean;
  collegeId?: string;
  collegeName?: string;
  rollNumber?: string;
  department?: string;
  batchYear?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTpoAdmin: boolean;
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

export const SUPER_ADMIN_EMAILS: string[] = [
  'venkatmukala9@gmail.com',
  'venkat.mukala9@gmail.com',
  'prepsunite@gmail.com',
];

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  if (SUPER_ADMIN_EMAILS.includes(clean)) return true;

  // Gmail dot & plus alias normalization
  if (clean.endsWith('@gmail.com') || clean.endsWith('@googlemail.com')) {
    const [userPart, domain] = clean.split('@');
    const normalizedUser = userPart.replace(/\./g, '').split('+')[0];
    const normalizedEmail = `${normalizedUser}@${domain}`;

    // Exact matches for primary PrepUnite Super Admins only
    if (normalizedEmail === 'venkatmukala9@gmail.com' || normalizedEmail === 'prepsunite@gmail.com') {
      return true;
    }

    return SUPER_ADMIN_EMAILS.some(admin => {
      const a = admin.toLowerCase();
      if (a.endsWith('@gmail.com') || a.endsWith('@googlemail.com')) {
        const [aUser, aDomain] = a.split('@');
        return `${aUser.replace(/\./g, '').split('+')[0]}@${aDomain}` === normalizedEmail;
      }
      return a === normalizedEmail;
    });
  }

  return false;
}

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
    let role = (localStorage.getItem('prepunite_role') as UserRole) || 'USER';
    const avatarUrl = localStorage.getItem('prepunite_user_avatar') || undefined;

    if (email && email !== 'guest@prepunite.com') {
      // 1. TPO Coordinator Check FIRST: If authorized as TPO, role is strictly TPO_ADMIN
      const tpoAuth = tpoService.findTpoAuthByEmail(email);
      if (tpoAuth || role === 'TPO_ADMIN') {
        const collegeId = tpoAuth?.college_id || localStorage.getItem('prepunite_college_id') || undefined;
        const collegeName = tpoAuth?.college_name || localStorage.getItem('prepunite_college_name') || undefined;
        role = 'TPO_ADMIN';
        localStorage.setItem('prepunite_role', 'TPO_ADMIN');
        return {
          id: email,
          name: name || formatDisplayNameFromEmail(email, ''),
          email,
          role: 'TPO_ADMIN',
          isTpoAdmin: true,
          collegeId,
          collegeName,
          avatarUrl,
        };
      }

      // 2. 🛡️ Super Admin Protection: Never allow cached 'USER' to demote true super admin
      if (isSuperAdminEmail(email)) {
        role = 'ADMIN';
        localStorage.setItem('prepunite_role', 'ADMIN');
      }

      const studentInfo = tpoService.getStudentEntitlementInfo(email);

      return {
        id: email,
        name: name || formatDisplayNameFromEmail(email, ''),
        email,
        role,
        avatarUrl,
        collegeId: studentInfo?.collegeId || localStorage.getItem('prepunite_college_id') || undefined,
        collegeName: studentInfo?.collegeName || localStorage.getItem('prepunite_college_name') || undefined,
      };
    }
  } catch (e) {
    console.warn('Failed to read cached user profile:', e);
  }
  return GUEST_USER;
};

const getInitialRole = (): UserRole => {
  try {
    const email = localStorage.getItem('prepunite_user_email');
    const cachedRole = localStorage.getItem('prepunite_role') as UserRole;
    if (cachedRole === 'TPO_ADMIN') return 'TPO_ADMIN';
    if (email) {
      if (tpoService.findTpoAuthByEmail(email)) {
        return 'TPO_ADMIN';
      }
      if (isSuperAdminEmail(email)) {
        return 'ADMIN';
      }
    }
    if (cachedRole) return cachedRole;
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
    assignedRole: UserRole = 'USER',
    collegeData?: {
      collegeId?: string;
      collegeName?: string;
      rollNumber?: string;
      department?: string;
      batchYear?: number;
      isTpoAdmin?: boolean;
    }
  ) => {
    // 🛡️ TPO Protection: If authorized as TPO, role is strictly TPO_ADMIN, NEVER ADMIN
    const isTpo = assignedRole === 'TPO_ADMIN' || Boolean(collegeData?.isTpoAdmin) || Boolean(tpoService.findTpoAuthByEmail(email));
    const finalRole: UserRole = isTpo ? 'TPO_ADMIN' : isSuperAdminEmail(email) ? 'ADMIN' : assignedRole;
    const name = formatDisplayNameFromEmail(email, nameInput);

    const newProfile: UserProfile = {
      id: email,
      name,
      email,
      role: finalRole,
      avatarUrl,
      isTpoAdmin: finalRole === 'TPO_ADMIN',
      collegeId: collegeData?.collegeId,
      collegeName: collegeData?.collegeName,
      rollNumber: collegeData?.rollNumber,
      department: collegeData?.department,
      batchYear: collegeData?.batchYear,
    };

    setUser(newProfile);
    setRole(finalRole);
    localStorage.setItem('prepunite_role', finalRole);
    localStorage.setItem('prepunite_user_email', email);
    localStorage.setItem('prepunite_user_name', name);
    if (avatarUrl) {
      localStorage.setItem('prepunite_user_avatar', avatarUrl);
    }
    if (collegeData?.collegeId) {
      localStorage.setItem('prepunite_college_id', collegeData.collegeId);
    }
    if (collegeData?.collegeName) {
      localStorage.setItem('prepunite_college_name', collegeData.collegeName);
    }
    return newProfile;
  };

  // Standard Database `public.profiles` Table Sync - role is strictly driven by the database table
  const syncProfileWithSupabase = async (
    userId: string,
    email: string,
    rawName: string,
    rawAvatar?: string,
    appRole?: string
  ) => {
    try {
      // 1. Check pre-authorized TPO records first (with resilient async cloud sync)
      const tpoAuth = await tpoService.findTpoAuthByEmailAsync(email);
      const isDbTpo = Boolean(tpoAuth);

      // 2. Check Super Admin: strictly PrepUnite owners, and NEVER an authorized TPO
      const isMasterAdmin = !isDbTpo && isSuperAdminEmail(email);

      // Safe, single-table query on baseline columns that ALWAYS exist in public.profiles
      const { data: dbProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role, name, avatar_url')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.warn('[syncProfileWithSupabase] Profile lookup notice:', profileError.message);
      }

      // Check database role column
      const dbRole = dbProfile?.role ? String(dbProfile.role).toLowerCase() : undefined;
      const isDbAdmin = !isDbTpo && (isMasterAdmin || dbRole === 'admin' || appRole === 'admin');

      let assignedRole: UserRole = 'USER';
      if (isDbTpo) assignedRole = 'TPO_ADMIN';
      else if (isDbAdmin) assignedRole = 'ADMIN';

      const finalName = dbProfile?.name || rawName;
      const finalAvatar = dbProfile?.avatar_url || rawAvatar;

      // 🛡️ Automatic Database Self-Healing:
      // If user is a Super Admin and database row has role !== 'admin'
      if (isMasterAdmin && userId) {
        if (!dbProfile || dbRole !== 'admin') {
          try {
            await supabase.from('profiles').upsert({
              id: userId,
              email: email,
              name: finalName || email.split('@')[0],
              role: 'admin',
              avatar_url: finalAvatar,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
            console.log('[syncProfileWithSupabase] 🛡️ Super Admin privileges verified & self-healed in database.');
          } catch (healErr) {
            console.warn('[syncProfileWithSupabase] Admin self-heal notice:', healErr);
          }
        }
      } else if (isDbTpo && userId && dbRole === 'admin') {
        // Demote from admin to user in DB if they were previously marked admin in profiles
        try {
          await supabase.from('profiles').update({
            role: 'user',
            updated_at: new Date().toISOString(),
          }).eq('id', userId);
        } catch (demoteErr) {
          console.warn('[syncProfileWithSupabase] TPO DB demote notice:', demoteErr);
        }
      } else if (!dbProfile && !profileError && userId && email) {
        // Only insert if row genuinely does NOT exist and no query error occurred
        try {
          await supabase.from('profiles').upsert({
            id: userId,
            email: email,
            name: finalName || email.split('@')[0],
            role: 'user', // keep DB role constraint valid ('user')
            avatar_url: finalAvatar,
          }, { onConflict: 'id' });
        } catch (uErr) {
          console.warn('[syncProfileWithSupabase] Profile creation notice:', uErr);
        }
      }

      const studentInfo = !isDbTpo ? tpoService.getStudentEntitlementInfo(email) : null;
      const anyProfile = dbProfile as any;

      applyUserProfile(email, finalName, finalAvatar, assignedRole, {
        collegeId: tpoAuth?.college_id || studentInfo?.collegeId || anyProfile?.college_id,
        collegeName: tpoAuth?.college_name || studentInfo?.collegeName,
        department: anyProfile?.department,
        rollNumber: anyProfile?.roll_number,
        batchYear: anyProfile?.batch_year,
        isTpoAdmin: isDbTpo,
      });
    } catch (err) {
      console.warn('[syncProfileWithSupabase] Fallback profile resolution:', err);
      const fallbackTpo = tpoService.findTpoAuthByEmail(email);
      const isFallbackTpo = Boolean(fallbackTpo);
      const isMasterAdmin = !isFallbackTpo && isSuperAdminEmail(email);
      const fallbackStudentInfo = !isFallbackTpo ? tpoService.getStudentEntitlementInfo(email) : null;

      applyUserProfile(
        email,
        rawName,
        rawAvatar,
        isFallbackTpo ? 'TPO_ADMIN' : isMasterAdmin ? 'ADMIN' : 'USER',
        fallbackTpo ? {
          collegeId: fallbackTpo.college_id,
          collegeName: fallbackTpo.college_name,
          isTpoAdmin: true,
        } : fallbackStudentInfo ? {
          collegeId: fallbackStudentInfo.collegeId,
          collegeName: fallbackStudentInfo.collegeName,
          isTpoAdmin: false,
        } : undefined
      );
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

  const getAppOrigin = () => {
    if (typeof window === 'undefined') return 'https://jobsfolder.vercel.app';
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return window.location.origin;
    }
    return 'https://jobsfolder.vercel.app';
  };

  // 1-Click Google OAuth 2.0 Sign In Handler
  const signInWithGoogle = async () => {
    try {
      const origin = getAppOrigin();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/dashboard`,
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
      const origin = getAppOrigin();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${origin}/dashboard`,
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
        const assignedRole: UserRole = isSuperAdminEmail(email) ? 'ADMIN' : 'USER';
        applyUserProfile(email, name, undefined, assignedRole);
      }
      return { error: null, data };
    } catch (err: any) {
      return { error: err.message || 'Invalid login credentials' };
    }
  };

  // Email & Password Sign Up
  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      const origin = getAppOrigin();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
          },
          emailRedirectTo: `${origin}/dashboard`,
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
      const origin = getAppOrigin();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/dashboard`,
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
      localStorage.removeItem('prepunite_college_id');
      localStorage.removeItem('prepunite_college_name');
    }
  };

  const currentTpoAuth = tpoService.findTpoAuthByEmail(user?.email);
  const isEffectiveTpo = Boolean(currentTpoAuth) || role === 'TPO_ADMIN' || Boolean(user?.isTpoAdmin);
  const isEffectiveAdmin = !isEffectiveTpo && (role === 'ADMIN' || isSuperAdminEmail(user?.email));
  const effectiveRole: UserRole = isEffectiveTpo ? 'TPO_ADMIN' : isEffectiveAdmin ? 'ADMIN' : (role || 'USER');

  return (
    <AuthContext.Provider
      value={{
        user: user ? { ...user, role: isEffectiveTpo ? 'TPO_ADMIN' : isEffectiveAdmin ? 'ADMIN' : user.role, isTpoAdmin: isEffectiveTpo } : null,
        role: effectiveRole,
        isAuthenticated: effectiveRole !== 'GUEST',
        isAdmin: isEffectiveAdmin,
        isTpoAdmin: isEffectiveTpo,
        isGuest: effectiveRole === 'GUEST',
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
