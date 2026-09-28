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
import { PrivacyPolicyView } from './components/legal/PrivacyPolicyView';
import { TermsView } from './components/legal/TermsView';
import { CookiePolicyView } from './components/legal/CookiePolicyView';
import { RefundPolicyView } from './components/legal/RefundPolicyView';
import { NotFoundView } from './components/common/NotFoundView';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { Footer } from './components/layout/Footer';
import { JWTAuthService } from './services/auth/jwtAuthService';

type AppRoute = 'LANDING' | 'ONBOARDING' | 'DASHBOARD' | 'PRIVACY' | 'TERMS' | 'COOKIES' | 'REFUND' | 'NOT_FOUND';

function MainAppOrchestrator() {
  const { isAuthenticated, user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('LANDING');

  // URL Path & Hash Listener for direct legal / 404 / auth routing
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      // Explicit legal routes
      if (path === '/privacy' || hash === '#privacy') {
        setCurrentRoute('PRIVACY');
        document.title = 'Privacy Policy — Gram-Disha';
        return;
      }
      if (path === '/terms' || hash === '#terms') {
        setCurrentRoute('TERMS');
        document.title = 'Terms of Advisory Service — Gram-Disha';
        return;
      }
      if (path === '/cookies' || hash === '#cookies') {
        setCurrentRoute('COOKIES');
        document.title = 'Cookie Policy — Gram-Disha';
        return;
      }
      if (path === '/refund' || hash === '#refund') {
        setCurrentRoute('REFUND');
        document.title = 'Zero Fee Policy — Gram-Disha';
        return;
      }
      if (path === '/404' || hash === '#404') {
        setCurrentRoute('NOT_FOUND');
        document.title = '404 Page Not Found — Gram-Disha';
        return;
      }

      // Check for active JWT session token in storage
      const rawToken = JWTAuthService.getStoredToken();
      let isJwtValid = false;
      let jwtProfile: any = null;

      if (rawToken) {
        const decoded = JWTAuthService.decodeToken(rawToken);
        if (decoded && decoded.isValid) {
          isJwtValid = true;
          const status = JWTAuthService.checkProfileStatus(decoded.payload.email);
          jwtProfile = status.profile;
        }
      }

      const activeUser = user || jwtProfile;
      const isUserAuthenticated = isAuthenticated || isJwtValid || !!activeUser;

      if (isUserAuthenticated) {
        // Clean up auth hash tags from URL once logged in
        if (['#login', '#signin', '#signup', '#register'].includes(hash) || ['/login', '/signin', '/signup', '/register'].includes(path)) {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }

        const isProfileComplete = activeUser?.location?.district && activeUser.location.district !== 'UNKNOWN';
        if (isProfileComplete || isJwtValid) {
          setCurrentRoute('DASHBOARD');
          document.title = 'Enterprise Workspace — Gram-Disha';
        } else {
          setCurrentRoute('ONBOARDING');
          document.title = 'Enterprise Onboarding — Gram-Disha';
        }
        return;
      }

      // Non-authenticated user trying to access /login or /signup
      if (path === '/login' || hash === '#login' || path === '/signin' || hash === '#signin') {
        setCurrentRoute('LANDING');
        document.title = 'Log In — Gram-Disha';
        return;
      }
      if (path === '/signup' || hash === '#signup' || path === '/register' || hash === '#register') {
        setCurrentRoute('LANDING');
        document.title = 'Sign Up — Gram-Disha';
        return;
      }

      setCurrentRoute('LANDING');
      document.title = 'Gram-Disha — Intelligent Business Guidance for Rural & Semi-Urban India';
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, [isAuthenticated, user]);

  const handleAuthenticated = (destination: 'DASHBOARD' | 'ONBOARDING') => {
    const hash = window.location.hash.toLowerCase();
    if (['#login', '#signin', '#signup', '#register'].includes(hash)) {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
    setCurrentRoute(destination);
  };

  const handleNavigateLegal = (page: 'PRIVACY' | 'TERMS' | 'COOKIES' | 'REFUND') => {
    window.location.hash = page.toLowerCase();
    setCurrentRoute(page as AppRoute);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#3B2F2A] flex flex-col justify-between">
      <main className="flex-1">
        {currentRoute === 'LANDING' && (
          <LandingPage 
            onAuthenticated={handleAuthenticated} 
            onNavigateLegal={handleNavigateLegal}
          />
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
            onNavigateLegal={handleNavigateLegal}
          />
        )}

        {currentRoute === 'PRIVACY' && (
          <PrivacyPolicyView onBack={() => setCurrentRoute('LANDING')} />
        )}

        {currentRoute === 'TERMS' && (
          <TermsView onBack={() => setCurrentRoute('LANDING')} />
        )}

        {currentRoute === 'COOKIES' && (
          <CookiePolicyView onBack={() => setCurrentRoute('LANDING')} />
        )}

        {currentRoute === 'REFUND' && (
          <RefundPolicyView onBack={() => setCurrentRoute('LANDING')} />
        )}

        {currentRoute === 'NOT_FOUND' && (
          <NotFoundView onGoHome={() => setCurrentRoute('LANDING')} />
        )}
      </main>

      {/* Global Footer on Legal pages or sub-views */}
      {['PRIVACY', 'TERMS', 'COOKIES', 'REFUND', 'NOT_FOUND'].includes(currentRoute) && (
        <Footer onNavigateLegal={handleNavigateLegal} />
      )}

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
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
