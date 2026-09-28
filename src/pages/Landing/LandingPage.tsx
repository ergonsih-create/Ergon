/**
 * @license
 * GRAM-DISHA — Production-Quality Public Landing Page
 * Team ERGON — Smart India Hackathon
 * 
 * Order of Sections:
 * 1. Navigation
 * 2. Hero
 * 3. Disha introduction
 * 4. The problem
 * 5. Gram-Disha solution
 * 6. How it works
 * 7. Hyper-local intelligence
 * 8. Business feasibility
 * 9. Financial structuring
 * 10. Government scheme matching
 * 11. Disha AI OS
 * 12. Complete business journey
 * 13. Who Gram-Disha helps
 * 14. Trust + evidence
 * 15. Core capabilities
 * 16. Final CTA
 * 17. Footer
 */

import React, { useState } from 'react';
import { LandingNavbar } from '../../components/navigation/LandingNavbar';
import { Hero } from './sections/Hero';
import { DishaIntro } from './sections/DishaIntro';
import { Problem } from './sections/Problem';
import { Solution } from './sections/Solution';
import { HowItWorks } from './sections/HowItWorks';
import { MarketIntelligence } from './sections/MarketIntelligence';
import { Feasibility } from './sections/Feasibility';
import { FinancialStructuring } from './sections/FinancialStructuring';
import { SchemeMatcher } from './sections/SchemeMatcher';
import { DishaOS } from './sections/DishaOS';
import { BusinessJourney } from './sections/BusinessJourney';
import { WhoItHelps } from './sections/WhoItHelps';
import { TrustEvidence } from './sections/TrustEvidence';
import { Capabilities } from './sections/Capabilities';
import { FinalCTA } from './sections/FinalCTA';
import { LandingFooter } from './sections/LandingFooter';
import { AuthModal } from '../Auth/AuthModal';

interface LandingPageProps {
  onAuthenticated?: (destination: 'DASHBOARD' | 'ONBOARDING') => void;
  onNavigateLegal?: (page: 'PRIVACY' | 'TERMS' | 'COOKIES' | 'REFUND') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onAuthenticated,
  onNavigateLegal 
}) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');

  // Listen to hash and URL path for direct /login or /signup routing
  React.useEffect(() => {
    const handleRouteSync = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (hash === '#login' || hash === '#signin' || path === '/login' || path === '/signin') {
        setAuthMode('LOGIN');
        setAuthModalOpen(true);
      } else if (hash === '#signup' || hash === '#register' || path === '/signup' || path === '/register') {
        setAuthMode('SIGNUP');
        setAuthModalOpen(true);
      }
    };

    handleRouteSync();
    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, []);

  const handleOpenAuth = (mode: 'GET_STARTED' | 'GOOGLE_SIGNIN' | 'LOGIN' | 'SIGNUP') => {
    const targetMode = (mode === 'LOGIN' || mode === 'GOOGLE_SIGNIN') ? 'LOGIN' : 'SIGNUP';
    setAuthMode(targetMode);
    setAuthModalOpen(true);
    if (window.location.hash !== (targetMode === 'LOGIN' ? '#login' : '#signup')) {
      window.history.pushState(null, '', targetMode === 'LOGIN' ? '#login' : '#signup');
    }
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
    if (['#login', '#signin', '#signup', '#register'].includes(window.location.hash.toLowerCase())) {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = (result: 'DASHBOARD' | 'ONBOARDING' | { isExistingUser?: boolean; user?: any }) => {
    setAuthModalOpen(false);
    let destination: 'DASHBOARD' | 'ONBOARDING' = 'ONBOARDING';
    if (typeof result === 'string') {
      destination = result;
    } else if (result && typeof result === 'object') {
      destination = result.isExistingUser ? 'DASHBOARD' : 'ONBOARDING';
    }
    onAuthenticated?.(destination);
  };

  return (
    <div id="landing_page_root" className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#3B2F2A] relative selection:bg-[#B45B4A]/15 selection:text-[#B45B4A]">
      
      {/* 1. Navigation */}
      <LandingNavbar
        onOpenAuth={handleOpenAuth}
        onNavigateSection={handleScrollToSection}
      />

      {/* Main Narrative Flow */}
      <main className="flex-1 w-full">
        {/* 2. Hero */}
        <Hero
          onStartJourney={() => handleOpenAuth('GET_STARTED')}
          onExploreHowItWorks={() => handleScrollToSection('how-it-works')}
        />

        {/* 3. Disha introduction */}
        <DishaIntro />

        {/* 4. The problem */}
        <Problem />

        {/* 5. Gram-Disha solution */}
        <Solution />

        {/* 6. How it works */}
        <HowItWorks />

        {/* 7. Hyper-local intelligence */}
        <MarketIntelligence />

        {/* 8. Business feasibility */}
        <Feasibility />

        {/* 9. Financial structuring */}
        <FinancialStructuring />

        {/* 10. Government scheme matching */}
        <SchemeMatcher />

        {/* 11. Disha AI OS */}
        <DishaOS />

        {/* 12. Complete business journey */}
        <BusinessJourney />

        {/* 13. Who Gram-Disha helps */}
        <WhoItHelps />

        {/* 14. Trust + evidence */}
        <TrustEvidence />

        {/* 15. Core capabilities */}
        <Capabilities />

        {/* 16. Final CTA */}
        <FinalCTA
          onStartWithDisha={() => handleOpenAuth('GET_STARTED')}
          onExplorePlatform={() => handleScrollToSection('how-it-works')}
        />
      </main>

      {/* 17. Footer */}
      <LandingFooter
        onNavigateSection={handleScrollToSection}
        onOpenPrivacy={() => onNavigateLegal ? onNavigateLegal('PRIVACY') : handleOpenAuth('GET_STARTED')}
        onOpenTerms={() => onNavigateLegal ? onNavigateLegal('TERMS') : handleOpenAuth('GET_STARTED')}
        onOpenCookies={() => onNavigateLegal ? onNavigateLegal('COOKIES') : handleOpenAuth('GET_STARTED')}
        onOpenRefund={() => onNavigateLegal ? onNavigateLegal('REFUND') : handleOpenAuth('GET_STARTED')}
      />

      {/* Real Official Unified Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuth}
        initialMode={authMode === 'LOGIN' ? 'GOOGLE_SIGNIN' : 'GET_STARTED'}
        onAuthSuccess={(result) => {
          handleAuthSuccess(result);
        }}
      />

    </div>
  );
};
