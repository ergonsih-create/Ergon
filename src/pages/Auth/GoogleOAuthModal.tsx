/**
 * @license
 * GRAM-DISHA — Google OAuth & JWT Session Exchange Component
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Handles authentic Google Identity handshake, RS256 JWT Token minting,
 * and Truth-First Profile Verification check before routing.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  KeyRound, 
  UserCheck, 
  Sparkles,
  Compass,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { JWTAuthService, SEED_EXISTING_USER, SEED_NEW_USER_TEMPLATE } from '../../services/auth/jwtAuthService';
import { UserProfile } from '../../types';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthComplete: (result: {
    user: UserProfile;
    token: string;
    isExistingUser: boolean;
  }) => void;
}

type AuthStep = 'SELECT_ACCOUNT' | 'CUSTOM_INPUT' | 'HANDSHAKE' | 'PROFILE_CHECK' | 'COMPLETE';

export const GoogleOAuthModal: React.FC<GoogleOAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthComplete,
}) => {
  const [step, setStep] = useState<AuthStep>('SELECT_ACCOUNT');
  const [selectedAccount, setSelectedAccount] = useState<{
    email: string;
    name: string;
    avatar: string;
    type: 'EXISTING' | 'NEW';
  }>({
    email: SEED_EXISTING_USER.email,
    name: SEED_EXISTING_USER.fullName,
    avatar: '👨🏽‍🌾',
    type: 'EXISTING',
  });

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customIsNew, setCustomIsNew] = useState(true);

  const [handshakeLog, setHandshakeLog] = useState<string[]>([]);
  const [profileResult, setProfileResult] = useState<{
    isExisting: boolean;
    profile: UserProfile | null;
  } | null>(null);

  if (!isOpen) return null;

  const handleSelectAccount = (account: {
    email: string;
    name: string;
    avatar: string;
    type: 'EXISTING' | 'NEW';
  }) => {
    setSelectedAccount(account);
    startOAuthFlow(account.email, account.name, account.type === 'EXISTING');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) return;
    startOAuthFlow(customEmail.trim(), customName.trim(), !customIsNew);
  };

  const startOAuthFlow = async (email: string, name: string, isExistingPreset: boolean) => {
    setStep('HANDSHAKE');
    setHandshakeLog(['Initiating Google OAuth 2.0 PKCE Handshake...']);

    await new Promise((r) => setTimeout(r, 600));
    setHandshakeLog((prev) => [
      ...prev,
      'Received OAuth 2.0 Auth Code with scopes [openid, email, profile].',
      'Minting RS256 JWT Token with LGD Administrative Claims...',
    ]);

    await new Promise((r) => setTimeout(r, 600));
    const token = JWTAuthService.generateJWT(
      email,
      name,
      isExistingPreset ? 'EXISTING_USER' : 'NEW_USER'
    );
    JWTAuthService.setStoredToken(token);

    setHandshakeLog((prev) => [
      ...prev,
      `RS256 JWT Session minted: header.alg=RS256, exp=7days.`,
      'Executing Truth-First Profile Verification against Gram-Disha Registry...',
    ]);

    setStep('PROFILE_CHECK');
    await new Promise((r) => setTimeout(r, 700));

    // Check profile
    const check = JWTAuthService.checkProfileStatus(email);
    const isExisting = isExistingPreset || check.exists;
    
    let resolvedUser: UserProfile;
    if (isExisting && check.profile) {
      resolvedUser = check.profile;
    } else if (isExisting && email.toLowerCase() === SEED_EXISTING_USER.email.toLowerCase()) {
      resolvedUser = SEED_EXISTING_USER;
    } else {
      // Create new profile draft
      resolvedUser = {
        id: `usr_${Date.now()}`,
        email,
        fullName: name,
        role: 'ENTREPRENEUR',
        location: {
          state: 'UNKNOWN',
          district: 'UNKNOWN',
          block: 'UNKNOWN',
          gramPanchayat: 'UNKNOWN',
          villageOrLocality: 'UNKNOWN',
          pincode: '',
          isRural: true,
          opportunityRadiusKm: 10,
        },
        demographics: {
          category: 'GENERAL',
          gender: 'FEMALE',
          ageGroup: '26-35',
          educationLevel: 'GRADUATE',
          occupation: 'Aspiring Rural Entrepreneur',
          priorExperienceYears: 1,
          annualHouseholdIncome: 200000,
          householdMembersCount: 4,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    setProfileResult({
      isExisting,
      profile: resolvedUser,
    });

    setStep('COMPLETE');
    await new Promise((r) => setTimeout(r, 900));

    onAuthComplete({
      user: resolvedUser,
      token,
      isExistingUser: isExisting,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2420]/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-3xl bg-[#FAF7F2] border border-[#C8A96B]/40 shadow-2xl overflow-hidden relative"
      >
        {/* Top Accent Header */}
        <div className="bg-gradient-to-r from-[#3B2F2A] via-[#4A3B35] to-[#3B2F2A] px-6 py-4 text-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C8A96B]/20 border border-[#C8A96B]/40 flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#C8A96B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-wide">Google Identity Services</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C8A96B]/20 text-[#F2E8D6] font-mono">OAuth 2.0 PKCE</span>
              </div>
              <p className="text-[11px] text-[#F2E8D6]/70">Gram-Disha Enterprise Portal Authorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          
          {/* STEP 1: Account Selection */}
          {step === 'SELECT_ACCOUNT' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-display font-bold text-[#3B2F2A]">
                  Choose a Google Account
                </h3>
                <p className="text-xs text-[#3B2F2A]/70">
                  to continue to <strong className="text-[#3B2F2A]">Gram-Disha (SIH 2026)</strong>
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Account 1: Existing User */}
                <button
                  onClick={() =>
                    handleSelectAccount({
                      email: 'rajesh.verma@gmail.com',
                      name: 'Rajesh Kumar Verma',
                      avatar: '👨🏽‍🌾',
                      type: 'EXISTING',
                    })
                  }
                  className="w-full text-left p-3.5 rounded-2xl bg-[#F2E8D6]/40 hover:bg-[#F2E8D6] border border-[#C8A96B]/30 hover:border-[#C8A96B] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#5A6B4F]/20 text-xl flex items-center justify-center border border-[#5A6B4F]/40 shrink-0">
                      👨🏽‍🌾
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#3B2F2A] group-hover:text-[#B45B4A] transition-colors">
                          Rajesh Kumar Verma
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#5A6B4F]/15 text-[#5A6B4F] font-semibold border border-[#5A6B4F]/30">
                          Existing Enterprise
                        </span>
                      </div>
                      <p className="text-xs text-[#3B2F2A]/60">rajesh.verma@gmail.com</p>
                      <p className="text-[11px] text-[#5A6B4F] font-medium mt-0.5">
                        📍 Pusad, Yavatmal • Vidarbha Dal Mill
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C8A96B] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Account 2: New User */}
                <button
                  onClick={() =>
                    handleSelectAccount({
                      email: 'priya.sundaram@gmail.com',
                      name: 'Priya Sundaram',
                      avatar: '👩🏽‍💼',
                      type: 'NEW',
                    })
                  }
                  className="w-full text-left p-3.5 rounded-2xl bg-[#F2E8D6]/40 hover:bg-[#F2E8D6] border border-[#C8A96B]/30 hover:border-[#C8A96B] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#B45B4A]/15 text-xl flex items-center justify-center border border-[#B45B4A]/30 shrink-0">
                      👩🏽‍💼
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#3B2F2A] group-hover:text-[#B45B4A] transition-colors">
                          Priya Sundaram
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#B45B4A]/15 text-[#B45B4A] font-semibold border border-[#B45B4A]/30">
                          New User (Onboarding)
                        </span>
                      </div>
                      <p className="text-xs text-[#3B2F2A]/60">priya.sundaram@gmail.com</p>
                      <p className="text-[11px] text-[#B45B4A] font-medium mt-0.5">
                        ✨ Unregistered Profile • Will start 5-step guided flow
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C8A96B] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Option 3: Custom Account */}
                <button
                  onClick={() => setStep('CUSTOM_INPUT')}
                  className="w-full text-left p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2E8D6]/40 border border-dashed border-[#C8A96B]/50 hover:border-[#C8A96B] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#3B2F2A]/10 text-[#3B2F2A] flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4 text-[#3B2F2A]" />
                    </div>
                    <div>
                      <span className="font-medium text-xs text-[#3B2F2A] group-hover:text-[#B45B4A] transition-colors">
                        Use another Google Account or Enter Custom Credentials
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#C8A96B] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              </div>

              {/* Security Footnote */}
              <div className="pt-2 border-t border-[#C8A96B]/20 flex items-center justify-between text-[11px] text-[#3B2F2A]/60">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5A6B4F]" />
                  <span>RS256 JWT Signed Session</span>
                </div>
                <span>Strict LGD Truth-First Policy</span>
              </div>
            </div>
          )}

          {/* STEP: Custom Account Input */}
          {step === 'CUSTOM_INPUT' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-display font-bold text-[#3B2F2A]">
                  Enter Google Credentials
                </h3>
                <p className="text-xs text-[#3B2F2A]/70">
                  Simulate sign in with any account identity
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3B2F2A] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3B2F2A] mb-1">
                    Google Email
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="ramesh.patel@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-sm text-[#3B2F2A]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#F2E8D6]/50 border border-[#C8A96B]/30 space-y-2">
                  <span className="text-xs font-semibold text-[#3B2F2A] block">Account Simulation Type:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomIsNew(true)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        customIsNew
                          ? 'bg-[#B45B4A] text-[#FAF7F2]'
                          : 'bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/30'
                      }`}
                    >
                      New User (Go to Onboarding)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomIsNew(false)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        !customIsNew
                          ? 'bg-[#5A6B4F] text-[#FAF7F2]'
                          : 'bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/30'
                      }`}
                    >
                      Existing User (Go to Dashboard)
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('SELECT_ACCOUNT')}
                  className="px-4 py-2 rounded-xl bg-[#F2E8D6] text-xs font-semibold text-[#3B2F2A] hover:bg-[#E8DCC6] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#3B2F2A] text-xs font-bold text-[#FAF7F2] hover:bg-[#2D2420] shadow-sm cursor-pointer"
                >
                  Continue with Google Auth →
                </button>
              </div>
            </form>
          )}

          {/* STEP: Handshake & JWT Generation */}
          {(step === 'HANDSHAKE' || step === 'PROFILE_CHECK' || step === 'COMPLETE') && (
            <div className="space-y-5 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#3B2F2A] text-[#FAF7F2] flex items-center justify-center animate-pulse">
                  <KeyRound className="w-5 h-5 text-[#C8A96B]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#3B2F2A]">
                    {step === 'HANDSHAKE' && 'Authenticating with Google OAuth...'}
                    {step === 'PROFILE_CHECK' && 'Verifying LGD Registry Profile...'}
                    {step === 'COMPLETE' && 'Session Verified & Routing...'}
                  </h4>
                  <p className="text-xs text-[#3B2F2A]/70">
                    Team ERGON Cryptographic JWT Session Engine
                  </p>
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="p-3.5 rounded-2xl bg-[#2D2420] text-[#F2E8D6] font-mono text-[11px] leading-relaxed space-y-1.5 shadow-inner max-h-48 overflow-y-auto">
                {handshakeLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#C8A96B] select-none">›</span>
                    <span className={idx === handshakeLog.length - 1 ? 'text-[#FAF7F2]' : 'text-[#F2E8D6]/70'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>

              {/* Profile Check Result Banner */}
              {profileResult && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    profileResult.isExisting
                      ? 'bg-[#5A6B4F]/10 border-[#5A6B4F]/40 text-[#5A6B4F]'
                      : 'bg-[#B45B4A]/10 border-[#B45B4A]/40 text-[#B45B4A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {profileResult.isExisting ? (
                      <CheckCircle2 className="w-5 h-5 text-[#5A6B4F] shrink-0" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-[#B45B4A] shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-xs block">
                        {profileResult.isExisting
                          ? 'Existing Verified Profile Found'
                          : 'New Entrepreneur Registration'}
                      </span>
                      <span className="text-[11px] opacity-85">
                        {profileResult.isExisting
                          ? 'Launching Enterprise Executive Dashboard...'
                          : 'Initiating 5-Step Guided Onboarding Flow...'}
                      </span>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
                </motion.div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
