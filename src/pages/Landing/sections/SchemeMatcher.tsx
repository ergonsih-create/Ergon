import React from 'react';
import { motion } from 'motion/react';
import { 
  Landmark, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { UnknownBadge } from '../../../components/ui/UnknownBadge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const SchemeMatcher: React.FC = () => {
  const { schemeMatcher } = LANDING_DATA;

  return (
    <section id="schemes" className="py-16 md:py-24 bg-[#F2E8D6]/20 relative border-b border-[#C8A96B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={schemeMatcher.eyebrow}
          headline={schemeMatcher.headline}
          description={schemeMatcher.description}
          align="center"
          className="mb-12"
        />

        {/* 3 Statutory States Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#5A6B4F]/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#5A6B4F] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#5A6B4F] uppercase tracking-wider block">
                POTENTIALLY ELIGIBLE
              </span>
              <p className="text-[11px] text-[#3B2F2A]/75 mt-0.5 leading-snug">
                All mandatory profile parameters pass current guidelines.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#B45B4A]/30 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-[#B45B4A] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#B45B4A] uppercase tracking-wider block">
                NOT ELIGIBLE
              </span>
              <p className="text-[11px] text-[#3B2F2A]/75 mt-0.5 leading-snug">
                One or more statutory criteria (e.g. project cap, education) fail.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-dashed border-[#C8A96B] flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#C8A96B] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#6B5324] uppercase tracking-wider block">
                UNKNOWN / DATA REQUIRED
              </span>
              <p className="text-[11px] text-[#3B2F2A]/75 mt-0.5 leading-snug">
                Missing required inputs (e.g. EDP training, caste certificate).
              </p>
            </div>
          </div>
        </div>

        {/* Sample Evaluated Government Schemes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {schemeMatcher.sampleSchemes.map((sch, idx) => (
            <motion.div
              key={sch.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <BentoCard
                variant="glass"
                className="h-full flex flex-col justify-between p-6 border-[#C8A96B]/25 hover:border-[#5A6B4F]/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="olive" size="sm">
                      {sch.status}
                    </Badge>
                    <span className="text-[10px] font-mono text-[#3B2F2A]/60">
                      Authority: {sch.authority}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-[#3B2F2A]">
                      {sch.name} ({sch.code})
                    </h3>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/20 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#3B2F2A]/70">Subsidy / Margin Money:</span>
                      <span className="font-bold text-[#5A6B4F]">{sch.subsidy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#3B2F2A]/70">Max Financial Scale:</span>
                      <span className="font-bold text-[#3B2F2A]">{sch.maxLoan}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-[#C8A96B]/20 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#3B2F2A]/70 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#C8A96B]" />
                    Mandatory Dossier Checklist Attached
                  </span>
                  <span className="text-[#B45B4A] font-semibold flex items-center gap-1">
                    Review Ruleset <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </BentoCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
