/**
 * @license
 * GRAM-DISHA — Main Application Root & Multi-Stage Orchestrator
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Flow Architecture:
 * LANDING → GET STARTED / LOGIN → GOOGLE OAUTH / AUTH MODAL → JWT SESSION → PROFILE CHECK
 *   → EXISTING USER → DASHBOARD (15 Modules + DISHA AI OS)
 *   → NEW USER → ONBOARDING (Location → Business → Finance → Requirements → Disha Brief) → DASHBOARD
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DishaProvider } from './context/DishaContext';
import { LandingPage } from './pages/Landing/LandingPage';
import { OnboardingFlow } from './pages/Onboarding/OnboardingFlow';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { JWTAuthService } from './services/auth/jwtAuthService';

type AppRoute = 'LANDING' | 'ONBOARDING' | 'DASHBOARD';

function MainAppOrchestrator() {
  const { isAuthenticated, user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('LANDING');

  // Initial Route Resolution based on active JWT session
  useEffect(() => {
    const rawToken = JWTAuthService.getStoredToken();
    if (rawToken) {
      const decoded = JWTAuthService.decodeToken(rawToken);
      if (decoded && decoded.isValid) {
        const { exists, profile } = JWTAuthService.checkProfileStatus(decoded.payload.email);
        if (exists && profile && profile.location.district !== 'UNKNOWN') {
          setCurrentRoute('DASHBOARD');
        } else {
          setCurrentRoute('ONBOARDING');
        }
        return;
      }
    }
    setCurrentRoute('LANDING');
  }, [isAuthenticated]);

  const handleAuthenticated = (destination: 'DASHBOARD' | 'ONBOARDING') => {
    if (destination === 'DASHBOARD') {
      setCurrentRoute('DASHBOARD');
    } else {
      setCurrentRoute('ONBOARDING');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#3B2F2A]">
      {currentRoute === 'LANDING' && (
        <LandingPage onAuthenticated={handleAuthenticated} />
      )}

      {currentRoute === 'ONBOARDING' && (
        <OnboardingFlow
          onComplete={() => setCurrentRoute('DASHBOARD')}
          onExitToLanding={() => setCurrentRoute('LANDING')}
        />
      )}

      {currentRoute === 'DASHBOARD' && (
        <DashboardPage
          onStartNewOnboarding={() => setCurrentRoute('ONBOARDING')}
          onExitToLanding={() => setCurrentRoute('LANDING')}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DishaProvider>
          <MainAppOrchestrator />
        </DishaProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
