import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Database, 
  FileCheck, 
  Calculator, 
  HelpCircle, 
  ArrowRight,
  AlertOctagon
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { UnknownBadge } from '../../../components/ui/UnknownBadge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const TrustEvidence: React.FC = () => {
  const { trustEvidence } = LANDING_DATA;

  return (
    <section id="trust-evidence" className="py-16 md:py-24 bg-[#F2E8D6]/20 relative border-b border-[#C8A96B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={trustEvidence.eyebrow}
          headline={trustEvidence.headline}
          description={trustEvidence.description}
          align="center"
          className="mb-14"
        />

        {/* 5-Step Provenance Chain */}
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          {trustEvidence.provenanceChain.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/25 space-y-2"
            >
              <span className="font-display font-bold text-xs text-[#5A6B4F] block">
                {p.step}
              </span>
              <p className="text-[11px] text-[#3B2F2A]/75 leading-relaxed font-sans">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The Signature UNKNOWN Principle Highlight Bento */}
        <BentoCard variant="elevated" className="p-7 sm:p-9 border-[#C8A96B]/40 shadow-xl bg-[#FAF7F2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <UnknownBadge label="THE UNKNOWN PRINCIPLE" />
                <Badge variant="gold" size="xs">Non-Negotiable Architecture</Badge>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#3B2F2A]">
                {trustEvidence.unknownPrinciple.title}
              </h3>

              <p className="text-sm text-[#3B2F2A]/80 leading-relaxed font-sans">
                {trustEvidence.unknownPrinciple.body}
              </p>
            </div>

            <div className="lg:col-span-4 p-5 rounded-2xl bg-[#F2E8D6]/60 border border-[#C8A96B]/30 space-y-2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-[#3B2F2A]">
                <ShieldCheck className="w-4 h-4 text-[#5A6B4F]" />
                <span>Truth-Bound System Rules</span>
              </div>
              <ul className="text-xs text-[#3B2F2A]/70 space-y-1 pt-1">
                <li>• Zero fabricated village prices</li>
                <li>• Zero imaginary scheme quotas</li>
                <li>• Auditable formulas on demand</li>
              </ul>
            </div>

          </div>
        </BentoCard>

      </div>
    </section>
  );
};
