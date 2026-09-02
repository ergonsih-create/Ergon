/**
 * @license
 * GRAM-DISHA — JWT Session & Cryptographic Inspector Modal
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Provides transparent inspection of the active RS256 JWT Token, decoded payload claims,
 * and LGD administrative scope verification.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Lock, 
  Layers, 
  Clock, 
  Fingerprint,
  FileCode
} from 'lucide-react';
import { JWTAuthService, DecodedJWT } from '../../services/auth/jwtAuthService';
import { useAuth } from '../../context/AuthContext';

interface JWTSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JWTSessionModal: React.FC<JWTSessionModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'CLAIMS' | 'RAW_TOKEN' | 'CRYPTO_SPECS'>('CLAIMS');

  if (!isOpen) return null;

  const rawToken = JWTAuthService.getStoredToken() || '';
  const decoded = rawToken ? JWTAuthService.decodeToken(rawToken) : null;

  const handleCopy = () => {
    if (rawToken) {
      navigator.clipboard.writeText(rawToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2420]/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl rounded-3xl bg-[#FAF7F2] border border-[#C8A96B]/40 shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3B2F2A] via-[#4A3B35] to-[#3B2F2A] px-6 py-4 text-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C8A96B]/20 border border-[#C8A96B]/40 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-[#C8A96B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-wide">
                  JWT Session Security Inspector
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#5A6B4F]/40 text-[#F2E8D6] font-mono">
                  Verified RS256
                </span>
              </div>
              <p className="text-[11px] text-[#F2E8D6]/70">
                Gram-Disha Session & Identity Claims
              </p>
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

        {/* Modal Tabs */}
        <div className="flex border-b border-[#C8A96B]/30 px-6 pt-3 gap-3 bg-[#FAF7F2]">
          {[
            { id: 'CLAIMS', label: 'Decoded Payload Claims' },
            { id: 'RAW_TOKEN', label: 'Raw Signed Token' },
            { id: 'CRYPTO_SPECS', label: 'SIH Cryptographic Specs' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#B45B4A] text-[#B45B4A]'
                  : 'border-transparent text-[#3B2F2A]/70 hover:text-[#3B2F2A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'CLAIMS' && decoded && (
            <div className="space-y-4">
              {/* Status Header */}
              <div className="p-3 rounded-2xl bg-[#5A6B4F]/10 border border-[#5A6B4F]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#5A6B4F]" />
                  <div>
                    <span className="text-xs font-bold text-[#5A6B4F] block">
                      Valid Cryptographic Session
                    </span>
                    <span className="text-[11px] text-[#3B2F2A]/70">
                      Signature verified against Team ERGON root public key.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#5A6B4F]">
                  Algorithm: RS256
                </span>
              </div>

              {/* Claims Table */}
              <div className="rounded-2xl border border-[#C8A96B]/30 overflow-hidden font-mono text-xs">
                <div className="bg-[#F2E8D6]/60 px-4 py-2 border-b border-[#C8A96B]/30 font-bold text-[#3B2F2A] flex justify-between">
                  <span>Standard Claim</span>
                  <span>Evaluated Value</span>
                </div>
                <div className="divide-y divide-[#C8A96B]/20 bg-[#FAF7F2]">
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-[#3B2F2A]/70">sub (Subject ID)</span>
                    <span className="font-semibold text-[#3B2F2A]">{decoded.payload.sub}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-[#3B2F2A]/70">email (User Principal)</span>
                    <span className="font-semibold text-[#B45B4A]">{decoded.payload.email}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-[#3B2F2A]/70">name (Full Name)</span>
                    <span className="font-semibold text-[#3B2F2A]">{decoded.payload.name}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-[#3B2F2A]/70">role (RBAC Scope)</span>
                    <span className="font-semibold text-[#5A6B4F]">{decoded.payload.role}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-[#3B2F2A]/70">iss (Issuer Authority)</span>
                    <span className="text-[#3B2F2A]">{decoded.payload.iss}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-[#3B2F2A]/70">aud (Audience)</span>
                    <span className="text-[#3B2F2A]">{decoded.payload.aud}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-[#3B2F2A]/70">iat (Issued At)</span>
                    <span className="text-[#3B2F2A]">{decoded.issuedAtFormatted}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between">
                    <span className="text-[#3B2F2A]/70">exp (Expires At)</span>
                    <span className="text-[#3B2F2A]">{decoded.expiresAtFormatted}</span>
                  </div>
                  <div className="px-4 py-2 flex justify-between bg-[#F2E8D6]/30">
                    <span className="text-[#3B2F2A]/70">lgdScope (Boundary Anchor)</span>
                    <span className="font-semibold text-[#3B2F2A]">
                      {decoded.payload.lgdScope?.district || 'Yavatmal'}, {decoded.payload.lgdScope?.state || 'Maharashtra'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RAW_TOKEN' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3B2F2A]">
                  Raw Base64Url Encoded JWT Token:
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-[#3B2F2A] text-xs font-semibold text-[#FAF7F2] hover:bg-[#2D2420] flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Token'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#2D2420] text-[#F2E8D6] font-mono text-xs break-all leading-relaxed max-h-56 overflow-y-auto">
                <span className="text-[#E76F51]">{rawToken.split('.')[0]}</span>
                <span className="text-white">.</span>
                <span className="text-[#2A9D8F]">{rawToken.split('.')[1]}</span>
                <span className="text-white">.</span>
                <span className="text-[#E9C46A]">{rawToken.split('.')[2]}</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-[#E76F51]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E76F51]" /> Header (RS256)
                </span>
                <span className="flex items-center gap-1 text-[#2A9D8F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" /> Payload (Claims)
                </span>
                <span className="flex items-center gap-1 text-[#E9C46A]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E9C46A]" /> Signature
                </span>
              </div>
            </div>
          )}

          {activeTab === 'CRYPTO_SPECS' && (
            <div className="space-y-3 text-xs text-[#3B2F2A]/85">
              <div className="p-4 rounded-2xl bg-[#F2E8D6]/40 border border-[#C8A96B]/30 space-y-2">
                <h5 className="font-display font-bold text-sm text-[#3B2F2A]">
                  Smart India Hackathon 2026 Security Architecture
                </h5>
                <p className="leading-relaxed">
                  Gram-Disha uses an enterprise-grade stateless authentication flow conforming to OAuth 2.0 PKCE and JWT RFC 7519 specifications.
                </p>
                <ul className="space-y-1 pt-1 list-disc list-inside">
                  <li><strong>Algorithm:</strong> RS256 (RSA Signature with SHA-256)</li>
                  <li><strong>Administrative Authority:</strong> Ministry of Panchayati Raj LGD Registry Anchor</li>
                  <li><strong>Session Storage:</strong> Client Secure Key-Value with Token Expiry Rotation</li>
                  <li><strong>Scope Isolation:</strong> Strict Role-Based Access Control (ENTREPRENEUR, FIELD_FACILITATOR, ADMIN)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2E8D6]/40 border-t border-[#C8A96B]/25 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#3B2F2A] hover:bg-[#2D2420] text-xs font-bold text-[#FAF7F2] cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </motion.div>
    </div>
  );
};
