/**
 * @license
 * GRAM-DISHA — 5-Step Guided Enterprise Onboarding Flow
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Flow: LOCATION -> BUSINESS -> FINANCE -> REQUIREMENTS -> DISHA BRIEF -> DASHBOARD
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Building2, 
  Calculator, 
  Wrench, 
  Sparkles, 
  Check, 
  ArrowLeft,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { LocationStep } from './steps/LocationStep';
import { BusinessStep } from './steps/BusinessStep';
import { FinanceStep } from './steps/FinanceStep';
import { RequirementsStep } from './steps/RequirementsStep';
import { DishaBriefStep } from './steps/DishaBriefStep';
import { useAuth } from '../../context/AuthContext';
import { LocationContext, BusinessContext, UserProfile } from '../../types';
import { JWTAuthService } from '../../services/auth/jwtAuthService';

interface OnboardingFlowProps {
  onComplete: () => void;
  onExitToLanding: () => void;
}

const STEPS = [
  { id: 1, label: 'Location', short: 'LGD Context', icon: MapPin },
  { id: 2, label: 'Business', short: 'Sector & Plan', icon: Building2 },
  { id: 3, label: 'Finance', short: 'Capital & Subsidy', icon: Calculator },
  { id: 4, label: 'Requirements', short: 'Infra & Assets', icon: Wrench },
  { id: 5, label: 'Disha Brief', short: 'Synthesis & Launch', icon: Sparkles },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onExitToLanding,
}) => {
  const { user, updateUserProfile, updateActiveBusiness } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [locationData, setLocationData] = useState<LocationContext>({
    state: user?.location.state !== 'UNKNOWN' ? user?.location.state || 'Maharashtra' : 'Maharashtra',
    district: user?.location.district !== 'UNKNOWN' ? user?.location.district || 'Yavatmal' : 'Yavatmal',
    block: user?.location.block !== 'UNKNOWN' ? user?.location.block || 'Pusad' : 'Pusad',
    gramPanchayat: user?.location.gramPanchayat !== 'UNKNOWN' ? user?.location.gramPanchayat || 'Shendurjana' : 'Shendurjana',
    villageOrLocality: user?.location.villageOrLocality !== 'UNKNOWN' ? user?.location.villageOrLocality || 'Shendurjana Khurd' : 'Shendurjana Khurd',
    pincode: user?.location.pincode || '445204',
    isRural: true,
    opportunityRadiusKm: 10,
    coordinates: {
      latitude: 19.9048,
      longitude: 77.5684,
    },
  });

  const [businessData, setBusinessData] = useState<Partial<BusinessContext>>({
    id: `biz_onboard_${Date.now()}`,
    title: 'Maa Annapurna Agro & Pulse Processing Unit',
    category: 'AGRO_PROCESSING',
    activity: 'AGRO_PROCESSING',
    stage: 'EARLY_PLANNING',
    scale: 'MICRO',
    description: 'Processing locally harvested farm pulses, wheat, and spices for direct supply to local consumer markets and regional mandis.',
    targetMarket: 'Local Gram Panchayat & APMC Wholesalers',
    isExisting: false,
    availableResources: ['Owned farm land', 'Family labor', 'Local mandi network'],
  });

  const [financeData, setFinanceData] = useState<{
    projectCost: number;
    promoterMargin: number;
    existingAssetsValue: number;
    workingCapitalNeed: number;
  }>({
    projectCost: 1000000,
    promoterMargin: 100000,
    existingAssetsValue: 150000,
    workingCapitalNeed: 200000,
  });

  const [requirementsData, setRequirementsData] = useState<{
    landStatus: string;
    powerStatus: string;
    waterStatus: string;
    machineryStatus: string;
    rawMaterialStatus: string;
    statutoryDocsReady: string[];
    unknownFactors: string[];
  }>({
    landStatus: 'OWNED',
    powerStatus: 'THREE_PHASE',
    waterStatus: 'AVAILABLE',
    machineryStatus: 'QUOTED',
    rawMaterialStatus: 'LOCAL_FARMERS',
    statutoryDocsReady: ['AADHAAR_CARD', 'PAN_CARD', 'BANK_PASSBOOK'],
    unknownFactors: [],
  });

  const handleFinishOnboarding = () => {
    // 1. Update User Profile
    const updatedProfile: Partial<UserProfile> = {
      location: locationData,
      updatedAt: new Date().toISOString(),
    };
    updateUserProfile(updatedProfile);

    // 2. Update Active Business
    const completedBusiness: BusinessContext = {
      id: businessData.id || `biz_${Date.now()}`,
      userId: user?.id,
      title: businessData.title || 'Micro Agro Enterprise',
      category: businessData.category || 'AGRO_PROCESSING',
      activity: businessData.activity || 'AGRO_PROCESSING',
      stage: businessData.stage || 'EARLY_PLANNING',
      scale: businessData.scale || 'MICRO',
      description: businessData.description || 'Rural micro enterprise',
      isExisting: false,
      proposedLocation: locationData,
      businessGoal: `Establish and grow a profitable ${businessData.title} in ${locationData.district}.`,
      availableResources: ['Land premises', 'Local labor'],
      expectedCustomers: businessData.targetMarket || 'Local community & mandi traders',
      targetMarket: businessData.targetMarket || 'Local & Regional',
      existingAssetsValue: financeData.existingAssetsValue,
    };
    updateActiveBusiness(completedBusiness);

    // 3. Save to registered profiles DB
    if (user) {
      const fullProfile: UserProfile = {
        ...user,
        location: locationData,
      };
      JWTAuthService.saveUserProfile(fullProfile);
    }

    // 4. Navigate to Dashboard
    onComplete();
  };

  return (
    <div id="onboarding_flow_root" className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#3B2F2A] relative selection:bg-[#B45B4A]/15 selection:text-[#B45B4A]">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#C8A96B]/25 py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3B2F2A] text-[#FAF7F2] flex items-center justify-center shadow-xs border border-[#C8A96B]/40">
              <Compass className="w-5 h-5 text-[#C8A96B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-[#3B2F2A]">
                  Gram-Disha
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#5A6B4F]/15 text-[#5A6B4F] font-semibold border border-[#5A6B4F]/30 uppercase">
                  Onboarding
                </span>
              </div>
              <p className="text-[11px] text-[#3B2F2A]/60 hidden sm:block">
                Guided Enterprise Structuring & Feasibility Verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-[#3B2F2A] block">
                {user?.fullName || 'New Entrepreneur'}
              </span>
              <span className="text-[10px] text-[#3B2F2A]/60 font-mono">
                {user?.email || 'authenticated'}
              </span>
            </div>
            <button
              type="button"
              onClick={onExitToLanding}
              className="px-3 py-1.5 rounded-xl bg-[#F2E8D6] hover:bg-[#E8DCC6] text-xs font-semibold text-[#3B2F2A] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit to Landing</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Stepper Progress Bar */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#C8A96B]/20 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              return (
                <div
                  key={step.id}
                  onClick={() => {
                    if (step.id < currentStep) setCurrentStep(step.id);
                  }}
                  className={`flex flex-col items-center text-center group transition-all ${
                    step.id < currentStep ? 'cursor-pointer' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[#5A6B4F] text-[#FAF7F2] shadow-xs'
                        : isCurrent
                        ? 'bg-[#3B2F2A] text-[#C8A96B] ring-2 ring-[#C8A96B] shadow-md scale-105'
                        : 'bg-[#F2E8D6] text-[#3B2F2A]/40'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-bold mt-1.5 ${
                      isCurrent
                        ? 'text-[#3B2F2A]'
                        : isCompleted
                        ? 'text-[#5A6B4F]'
                        : 'text-[#3B2F2A]/40'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-[#3B2F2A]/60 hidden md:block">
                    {step.short}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress track line */}
          <div className="w-full h-1 bg-[#F2E8D6] rounded-full mt-3 overflow-hidden">
            <motion.div
              className="h-full bg-[#3B2F2A]"
              initial={{ width: '20%' }}
              animate={{ width: `${(currentStep / 5) * 100}%` }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>

      {/* Step Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#C8A96B]/30 shadow-xl p-6 sm:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              {currentStep === 1 && (
                <LocationStep
                  location={locationData}
                  onChange={(upd) => setLocationData((prev) => ({ ...prev, ...upd }))}
                  onNext={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <BusinessStep
                  business={businessData}
                  onChange={(upd) => setBusinessData((prev) => ({ ...prev, ...upd }))}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <FinanceStep
                  business={businessData}
                  isRural={locationData.isRural}
                  userCategory={user?.demographics?.category || 'OBC'}
                  onChange={(upd) => setFinanceData(upd)}
                  onNext={() => setCurrentStep(4)}
                  onBack={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && (
                <RequirementsStep
                  onChange={(upd) => setRequirementsData(upd)}
                  onNext={() => setCurrentStep(5)}
                  onBack={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 5 && (
                <DishaBriefStep
                  location={locationData}
                  business={businessData}
                  finance={financeData}
                  requirements={requirementsData}
                  onLaunchDashboard={handleFinishOnboarding}
                  onBack={() => setCurrentStep(4)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#3B2F2A]/60 border-t border-[#C8A96B]/20">
        Team ERGON • Smart India Hackathon 2026 • Truth-First Architecture
      </footer>

    </div>
  );
};
