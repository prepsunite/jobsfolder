import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

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
  loginAsUser: (name?: string, email?: string) => void;
  loginAsAdmin: (password?: string) => boolean;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
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

  useEffect(() => {
    localStorage.setItem('prepunite_role', role);
  }, [role]);

  const loginAsUser = (name = 'Alex Rivera', email = 'alex.rivera@student.edu') => {
    const newUser: UserProfile = {
      ...STUDENT_USER,
      name,
      email,
    };
    setUser(newUser);
    setRole('USER');
  };

  const loginAsAdmin = (password = 'admin123') => {
    if (password === 'admin123' || password === 'admin') {
      setUser(ADMIN_USER);
      setRole('ADMIN');
      return true;
    }
    return false;
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'GUEST') setUser(GUEST_USER);
    if (newRole === 'USER') setUser(STUDENT_USER);
    if (newRole === 'ADMIN') setUser(ADMIN_USER);
  };

  const logout = () => {
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
