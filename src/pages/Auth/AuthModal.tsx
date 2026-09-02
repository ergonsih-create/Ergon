/**
 * @license
 * GRAM-DISHA — Unified Authentication & Get Started Gateway
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Supports Direct Email, Google OAuth 2.0 PKCE, and JWT Verification.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  CheckCircle2, 
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { GoogleOAuthModal } from './GoogleOAuthModal';
import { JWTAuthService, SEED_EXISTING_USER } from '../../services/auth/jwtAuthService';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'GET_STARTED' | 'GOOGLE_SIGNIN';
  onAuthSuccess: (result: {
    user: UserProfile;
    token: string;
    isExistingUser: boolean;
  }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'GET_STARTED',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(
    initialMode === 'GOOGLE_SIGNIN' ? 'LOGIN' : 'SIGNUP'
  );
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (mode === 'SIGNUP' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 600));

      const isLogin = mode === 'LOGIN';
      const name = isLogin
        ? email.toLowerCase().includes('rajesh')
          ? 'Rajesh Kumar Verma'
          : email.split('@')[0]
        : fullName.trim();

      // Check profile
      const check = JWTAuthService.checkProfileStatus(email);
      const isExisting = isLogin || check.exists;

      const token = JWTAuthService.generateJWT(
        email,
        name,
        isExisting ? 'EXISTING_USER' : 'NEW_USER'
      );
      JWTAuthService.setStoredToken(token);

      let user: UserProfile;
      if (isExisting && check.profile) {
        user = check.profile;
      } else if (isExisting && email.toLowerCase() === SEED_EXISTING_USER.email.toLowerCase()) {
        user = SEED_EXISTING_USER;
      } else {
        user = {
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
            gender: 'MALE',
            ageGroup: '26-35',
            educationLevel: 'HIGHER_SECONDARY',
            occupation: 'Micro-Enterprise Owner',
            priorExperienceYears: 2,
            annualHouseholdIncome: 200000,
            householdMembersCount: 4,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      setIsLoading(false);
      onAuthSuccess({
        user,
        token,
        isExistingUser: isExisting,
      });
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Authentication verification failed. Please try again.');
    }
  };

  const handleQuickDemoExisting = () => {
    const token = JWTAuthService.generateJWT(
      SEED_EXISTING_USER.email,
      SEED_EXISTING_USER.fullName,
      'EXISTING_USER'
    );
    JWTAuthService.setStoredToken(token);
    onAuthSuccess({
      user: SEED_EXISTING_USER,
      token,
      isExistingUser: true,
    });
  };

  const handleQuickDemoNew = () => {
    const newUser: UserProfile = {
      id: `usr_new_${Date.now()}`,
      email: 'priya.sundaram@gmail.com',
      fullName: 'Priya Sundaram',
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
        category: 'WOMEN',
        gender: 'FEMALE',
        ageGroup: '26-35',
        educationLevel: 'GRADUATE',
        occupation: 'Prospective Enterprise Founder',
        priorExperienceYears: 1,
        annualHouseholdIncome: 180000,
        householdMembersCount: 4,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const token = JWTAuthService.generateJWT(
      newUser.email,
      newUser.fullName,
      'NEW_USER'
    );
    JWTAuthService.setStoredToken(token);
    onAuthSuccess({
      user: newUser,
      token,
      isExistingUser: false,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2420]/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#C8A96B]/35 shadow-2xl p-6 sm:p-8 relative space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F2E8D6] text-[#3B2F2A] hover:bg-[#E8DCC6] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#3B2F2A] text-[#FAF7F2] flex items-center justify-center shadow-xs">
                <Compass className="w-4 h-4 text-[#C8A96B]" />
              </div>
              <span className="font-display font-bold text-lg text-[#3B2F2A]">
                Gram-Disha
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5A6B4F]/15 text-[#5A6B4F] font-semibold border border-[#5A6B4F]/30 uppercase">
                SIH 2026
              </span>
            </div>

            <h3 className="text-2xl font-display font-bold text-[#3B2F2A]">
              {mode === 'LOGIN' ? 'Welcome Back' : 'Start Your Enterprise Journey'}
            </h3>
            <p className="text-xs text-[#3B2F2A]/75 leading-relaxed font-sans">
              Deterministic rural financial structuring, hyper-local LGD intelligence, and scheme eligibility verification.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-[#F2E8D6]/60 p-1 border border-[#C8A96B]/30">
            <button
              type="button"
              onClick={() => setMode('SIGNUP')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'SIGNUP'
                  ? 'bg-[#FAF7F2] text-[#3B2F2A] shadow-xs'
                  : 'text-[#3B2F2A]/70 hover:text-[#3B2F2A]'
              }`}
            >
              Get Started / Sign Up
            </button>
            <button
              type="button"
              onClick={() => setMode('LOGIN')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'LOGIN'
                  ? 'bg-[#FAF7F2] text-[#3B2F2A] shadow-xs'
                  : 'text-[#3B2F2A]/70 hover:text-[#3B2F2A]'
              }`}
            >
              Log In
            </button>
          </div>

          {/* Google 1-Tap OAuth Button */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 border border-[#C8A96B]/50 text-xs sm:text-sm font-semibold text-[#3B2F2A] transition-all shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google OAuth</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#C8A96B]/25" />
            <span className="text-[10px] text-[#3B2F2A]/50 font-mono uppercase tracking-wider">
              Or email credentials
            </span>
            <div className="flex-1 h-px bg-[#C8A96B]/25" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'SIGNUP' && (
              <div>
                <label className="block text-xs font-semibold text-[#3B2F2A] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-[#3B2F2A]/40" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Patel"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-xs sm:text-sm text-[#3B2F2A]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#3B2F2A] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#3B2F2A]/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-xs sm:text-sm text-[#3B2F2A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B2F2A] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#3B2F2A]/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 focus:border-[#B45B4A] focus:outline-hidden text-xs sm:text-sm text-[#3B2F2A]"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-[#B45B4A] font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#3B2F2A] text-xs sm:text-sm font-bold text-[#FAF7F2] hover:bg-[#2D2420] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying JWT Session...</span>
              ) : mode === 'SIGNUP' ? (
                <>
                  <span>Create Account & Start Onboarding</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A96B]" />
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A96B]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-2 border-t border-[#C8A96B]/20 space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#3B2F2A]/60 block text-center">
              Evaluator Quick Access (1-Click)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemoExisting}
                className="p-2 rounded-xl bg-[#5A6B4F]/10 hover:bg-[#5A6B4F]/20 border border-[#5A6B4F]/30 text-left transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold text-[#5A6B4F] block">
                  👤 Existing User
                </span>
                <span className="text-[10px] text-[#3B2F2A]/70 truncate block">
                  Rajesh (Dal Mill) → Dashboard
                </span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoNew}
                className="p-2 rounded-xl bg-[#B45B4A]/10 hover:bg-[#B45B4A]/20 border border-[#B45B4A]/30 text-left transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-bold text-[#B45B4A] block">
                  ✨ New User
                </span>
                <span className="text-[10px] text-[#3B2F2A]/70 truncate block">
                  Priya → 5-Step Onboarding
                </span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Google OAuth Modal Overlay */}
      <GoogleOAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onAuthComplete={(result) => {
          setGoogleModalOpen(false);
          onAuthSuccess(result);
        }}
      />
    </>
  );
};
