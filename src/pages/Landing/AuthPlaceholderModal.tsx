import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface AuthPlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'GET_STARTED' | 'GOOGLE_SIGNIN';
}

export const AuthPlaceholderModal: React.FC<AuthPlaceholderModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'GET_STARTED',
}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2420]/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#C8A96B]/30 shadow-2xl p-6 sm:p-8 relative space-y-6"
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
            <div className="w-8 h-8 rounded-xl bg-[#3B2F2A] text-[#FAF7F2] flex items-center justify-center shadow-2xs">
              <Compass className="w-4 h-4 text-[#C8A96B]" />
            </div>
            <span className="font-display font-bold text-lg text-[#3B2F2A]">
              Gram-Disha
            </span>
            <Badge variant="olive" size="xs">Stage 1 Preview</Badge>
          </div>

          <h3 className="text-xl font-display font-bold text-[#3B2F2A]">
            {initialMode === 'GOOGLE_SIGNIN' ? 'Sign in with Google' : 'Start Your Business Journey'}
          </h3>
          <p className="text-xs text-[#3B2F2A]/75 leading-relaxed font-sans">
            Access hyper-local market intelligence, mathematical feasibility scoring (HBFS), and versioned government scheme matching.
          </p>
        </div>

        {/* Action Content */}
        {!submitted ? (
          <div className="space-y-4">
            
            {/* Google OAuth CTA */}
            <button
              onClick={() => setSubmitted(true)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2E8D6]/60 border border-[#C8A96B]/40 text-xs sm:text-sm font-semibold text-[#3B2F2A] transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Continue with Google Account</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#C8A96B]/25" />
              <span className="text-[11px] text-[#3B2F2A]/50 font-mono uppercase">Or Enter Email</span>
              <div className="flex-1 h-px bg-[#C8A96B]/25" />
            </div>

            {/* Email form */}
            <div className="space-y-3">
              <input
                type="email"
                placeholder="enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/40 text-xs sm:text-sm text-[#3B2F2A] placeholder:text-[#3B2F2A]/40 focus:outline-none focus:ring-2 focus:ring-[#C8A96B]"
              />

              <Button
                variant="terracotta"
                size="md"
                onClick={() => setSubmitted(true)}
                className="w-full justify-center text-xs sm:text-sm font-semibold"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Access Public Platform Demo
              </Button>
            </div>

            <div className="p-3 rounded-xl bg-[#F2E8D6]/60 border border-[#C8A96B]/25 text-[11px] text-[#3B2F2A]/70 leading-snug flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5A6B4F] shrink-0" />
              <span>Full backend JWT auth + FastAPI will connect in Stage 2.</span>
            </div>

          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#5A6B4F]/10 border border-[#5A6B4F]/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#5A6B4F] text-[#FAF7F2] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-[#3B2F2A]">
              Welcome to the Gram-Disha Experience
            </h4>
            <p className="text-xs text-[#3B2F2A]/80 leading-relaxed">
              You are exploring the verified Stage 1 Public Landing Page foundation. All architectural sections are interactive below.
            </p>
            <Button
              variant="terracotta"
              size="sm"
              onClick={onClose}
              className="mt-2 text-xs"
            >
              Explore Landing Page
            </Button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
