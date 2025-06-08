import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { signIn as dbSignIn, signUp as dbSignUp, updateProfile as dbUpdateProfile, updatePassword as dbUpdatePassword } from '../lib/db';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { user: authUser, error } = dbSignIn(email, password);
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      if (authUser) {
        setUser(authUser);
        localStorage.setItem('currentUser', JSON.stringify(authUser));
      }
      
      return { error: null };
    } catch (err) {
      console.error('Sign in exception:', err);
      return { error: err };
    }
  };

  const handleSignUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { user: newUser, error } = dbSignUp(email, password, userData);
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      console.error('Sign up exception:', err);
      return { error: err };
    }
  };

  const handleSignOut = async () => {
    document.body.classList.add('animate-slideIn');
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
    setTimeout(() => {
      document.body.classList.remove('animate-slideIn');
    }, 100);
  };

  const handleUpdateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) {
        return { error: 'User not authenticated' };
      }
      
      const { success, error } = dbUpdateProfile(user.id, updates);
      
      if (error) {
        return { error };
      }
      
      if (success) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      return { error: null };
    } catch (err) {
      console.error('Update profile error:', err);
      return { error: err };
    }
  };

  const handleUpdatePassword = async (password: string) => {
    try {
      if (!user) {
        return { error: 'User not authenticated' };
      }
      
      const { success, error } = dbUpdatePassword(user.id, password);
      
      return { error: error || null };
    } catch (err) {
      console.error('Update password error:', err);
      return { error: err };
    }
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    updatePassword: handleUpdatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};