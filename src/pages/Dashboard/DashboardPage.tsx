/**
 * @license
 * GRAM-DISHA — Master Dashboard & Multi-Module Workspace Page
 * Team ERGON — Smart India Hackathon 2026
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppHeader } from '../../components/layout/AppHeader';
import { AppNavigation } from '../../components/layout/AppNavigation';
import { DishaAdvisorDrawer } from '../../components/disha/DishaAdvisorDrawer';
import { JWTSessionModal } from '../../components/layout/JWTSessionModal';
import { useDisha } from '../../context/DishaContext';
import { useAuth } from '../../context/AuthContext';
import { DishaContextState } from '../../types';

// 15 Modular Enterprise Workspace Views
import { DashboardView } from '../../components/views/DashboardView';
import { BusinessIdeasView } from '../../components/views/BusinessIdeasView';
import { LocationView } from '../../components/views/LocationView';
import { MarketInsightsView } from '../../components/views/MarketInsightsView';
import { FeasibilityView } from '../../components/views/FeasibilityView';
import { FinanceView } from '../../components/views/FinanceView';
import { SchemesView } from '../../components/views/SchemesView';
import { DocumentsView } from '../../components/views/DocumentsView';
import { ApplicationsView } from '../../components/views/ApplicationsView';
import { InventoryOperationsView } from '../../components/views/InventoryOperationsView';
import { ActionPlanView } from '../../components/views/ActionPlanView';
import { ProgressView } from '../../components/views/ProgressView';
import { LearningResourcesView } from '../../components/views/LearningResourcesView';
import { SupportGrievanceView } from '../../components/views/SupportGrievanceView';
import { AdminDatasetsView } from '../../components/views/AdminDatasetsView';

interface DashboardPageProps {
  onStartNewOnboarding: () => void;
  onExitToLanding: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartNewOnboarding,
  onExitToLanding,
}) => {
  const { dishaState, setModule } = useDisha();
  const currentModule = dishaState.currentModule;
  const { user } = useAuth();
  const [isJWTModalOpen, setIsJWTModalOpen] = useState(false);

  // Render the matching module view
  const renderActiveView = () => {
    switch (currentModule) {
      case 'DASHBOARD':
        return <DashboardView onNavigate={(mod) => setModule(mod)} />;
      case 'BUSINESS_IDEAS':
        return <BusinessIdeasView onNavigate={(mod) => setModule(mod)} />;
      case 'LOCATION':
        return <LocationView />;
      case 'MARKET_INSIGHTS':
        return <MarketInsightsView />;
      case 'FEASIBILITY':
      case 'SWOT':
      case 'OUTLOOK':
        return <FeasibilityView onNavigate={(mod) => setModule(mod)} />;
      case 'FINANCE':
      case 'PROJECT_COST':
      case 'FINANCIAL_STRUCTURE':
      case 'LOANS_EMI':
      case 'CASH_FLOW':
      case 'WORKING_CAPITAL':
        return <FinanceView onNavigate={(mod) => setModule(mod)} />;
      case 'SCHEMES':
        return <SchemesView onNavigate={(mod) => setModule(mod)} />;
      case 'DOCUMENTS':
        return <DocumentsView onNavigate={(mod) => setModule(mod)} />;
      case 'APPLICATIONS':
        return <ApplicationsView />;
      case 'INVENTORY':
      case 'SALES':
        return <InventoryOperationsView />;
      case 'ACTION_PLAN':
        return <ActionPlanView />;
      case 'PROGRESS':
        return <ProgressView />;
      case 'LEARNING':
        return <LearningResourcesView />;
      case 'SUPPORT':
        return <SupportGrievanceView />;
      case 'ADMIN':
        return <AdminDatasetsView />;
      default:
        return <DashboardView onNavigate={(mod) => setModule(mod)} />;
    }
  };

  return (
    <div id="dashboard_page_root" className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#3B2F2A] relative selection:bg-[#B45B4A]/15 selection:text-[#B45B4A]">
      
      {/* Universal Liquid Glass App Header */}
      <AppHeader
        onNavigateToAdmin={() => setModule('ADMIN')}
        onOpenJWTModal={() => setIsJWTModalOpen(true)}
        onStartNewOnboarding={onStartNewOnboarding}
        onExitToLanding={onExitToLanding}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6">
        
        {/* Navigation Bar / Tabs */}
        <AppNavigation
          activeModule={currentModule}
          onSelectModule={(mod) => setModule(mod)}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentModule}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global DISHA AI Assistant Drawer */}
      <DishaAdvisorDrawer />

      {/* Cryptographic RS256 JWT Token Inspector Modal */}
      <JWTSessionModal
        isOpen={isJWTModalOpen}
        onClose={() => setIsJWTModalOpen(false)}
      />

      {/* Minimal Heritage Footer */}
      <footer className="py-4 border-t border-[#C8A96B]/20 text-center text-xs text-[#3B2F2A]/60 bg-[#FAF7F2]">
        Team ERGON • Smart India Hackathon 2026 • Evidence-Informed Decision Architecture
      </footer>

    </div>
  );
};
