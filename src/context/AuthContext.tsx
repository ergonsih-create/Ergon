/**
 * @license
 * GRAM-DISHA — Authentication & User Profile Context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, BusinessContext, UserRole } from '../types';
import { CURATED_BUSINESS_TEMPLATES } from '../data/sampleBusinesses';

interface AuthContextType {
  user: UserProfile | null;
  activeBusiness: BusinessContext;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateActiveBusiness: (business: Partial<BusinessContext>) => void;
  switchBusinessTemplate: (templateId: string) => void;
  loginWithGoogleMock: (email?: string, name?: string) => Promise<void>;
  logout: () => void;
}

const DEMO_USER: UserProfile = {
  id: 'usr_ergon_demo_01',
  email: 'ergonsih@gmail.com',
  fullName: 'Rajesh Kumar Verma',
  role: 'ENTREPRENEUR',
  location: {
    state: 'Maharashtra',
    district: 'Yavatmal',
    block: 'Pusad',
    gramPanchayat: 'Shendurjana',
    villageOrLocality: 'Shendurjana Khurd',
    pincode: '445204',
    isRural: true,
    opportunityRadiusKm: 10,
    coordinates: {
      latitude: 19.9048,
      longitude: 77.5684
    }
  },
  demographics: {
    category: 'OBC',
    gender: 'MALE',
    ageGroup: '26-35',
    educationLevel: 'HIGHER_SECONDARY',
    occupation: 'Farmer & Prospective Micro-Entrepreneur',
    priorExperienceYears: 4,
    annualHouseholdIncome: 220000,
    householdMembersCount: 5,
  },
  createdAt: '2026-01-15T10:00:00.000Z',
  updatedAt: '2026-03-01T12:00:00.000Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeBusiness, setActiveBusiness] = useState<BusinessContext>(() => {
    const stored = localStorage.getItem('gram_disha_active_business');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return CURATED_BUSINESS_TEMPLATES[0].context;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('gram_disha_user_session');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(DEMO_USER);
        localStorage.setItem('gram_disha_user_session', JSON.stringify(DEMO_USER));
      }
    } catch (e) {
      setUser(DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setUserRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('gram_disha_user_session', JSON.stringify(updated));
  };

  const updateUserProfile = (profileUpdates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = {
      ...user,
      ...profileUpdates,
      updatedAt: new Date().toISOString()
    };
    setUser(updated);
    localStorage.setItem('gram_disha_user_session', JSON.stringify(updated));
  };

  const updateActiveBusiness = (businessUpdates: Partial<BusinessContext>) => {
    const updated = {
      ...activeBusiness,
      ...businessUpdates
    };
    setActiveBusiness(updated);
    localStorage.setItem('gram_disha_active_business', JSON.stringify(updated));
  };

  const switchBusinessTemplate = (templateId: string) => {
    const template = CURATED_BUSINESS_TEMPLATES.find(t => t.context.id === templateId);
    if (template) {
      setActiveBusiness(template.context);
      localStorage.setItem('gram_disha_active_business', JSON.stringify(template.context));
    }
  };

  const loginWithGoogleMock = async (email = 'ergonsih@gmail.com', name = 'Rajesh Kumar Verma') => {
    setIsLoading(true);
    const newUser: UserProfile = {
      ...DEMO_USER,
      email,
      fullName: name,
    };
    setUser(newUser);
    localStorage.setItem('gram_disha_user_session', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gram_disha_user_session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeBusiness,
        isAuthenticated: !!user,
        isLoading,
        setUserRole,
        updateUserProfile,
        updateActiveBusiness,
        switchBusinessTemplate,
        loginWithGoogleMock,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
