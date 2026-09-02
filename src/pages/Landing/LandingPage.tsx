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
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthenticated }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');

  const handleOpenAuth = (mode: 'GET_STARTED' | 'GOOGLE_SIGNIN') => {
    setAuthMode(mode === 'GOOGLE_SIGNIN' ? 'LOGIN' : 'SIGNUP');
    setAuthModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = (destination: 'DASHBOARD' | 'ONBOARDING') => {
    setAuthModalOpen(false);
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
        onOpenPrivacy={() => handleOpenAuth('GET_STARTED')}
        onOpenTerms={() => handleOpenAuth('GET_STARTED')}
        onOpenAccessibility={() => handleOpenAuth('GET_STARTED')}
      />

      {/* Real Full-Featured JWT & Google OAuth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
};
