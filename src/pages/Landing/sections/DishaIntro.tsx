import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  Search, 
  Database, 
  SlidersHorizontal, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const DishaIntro: React.FC = () => {
  const { dishaIntro } = LANDING_DATA;

  const icons = [
    <Target className="w-5 h-5 text-[#5A6B4F]" />,
    <Search className="w-5 h-5 text-[#C8A96B]" />,
    <Database className="w-5 h-5 text-[#3B2F2A]" />,
    <SlidersHorizontal className="w-5 h-5 text-[#B45B4A]" />,
    <CheckCircle2 className="w-5 h-5 text-[#5A6B4F]" />,
  ];

  return (
    <section id="disha-intro" className="py-16 md:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={dishaIntro.badge}
          headline={dishaIntro.headline}
          description={dishaIntro.subhead}
          align="center"
          className="mb-14"
        />

        {/* Large Glass Bento Composition: 5-Stage Orchestration Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-5">
          {dishaIntro.pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <BentoCard
                variant="glass"
                className="h-full flex flex-col justify-between p-5 border-[#C8A96B]/25 hover:border-[#5A6B4F]/40"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/30 flex items-center justify-center shadow-2xs">
                      {icons[idx]}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#C8A96B]">
                      {pillar.phase}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#3B2F2A] leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#3B2F2A]/75 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                {/* Arrow indicator between steps on desktop */}
                {idx < dishaIntro.pillars.length - 1 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#C8A96B]/40 flex items-center justify-center shadow-xs">
                      <ArrowRight className="w-3 h-3 text-[#C8A96B]" />
                    </div>
                  </div>
                )}
              </BentoCard>
            </motion.div>
          ))}
        </div>

        {/* Non-Replacement Guarantee Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-[#F2E8D6]/60 border border-[#C8A96B]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#3B2F2A]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#5A6B4F] shrink-0" />
            <span className="font-medium">
              <strong>Deterministic Core Guarantee:</strong> Disha guides your decisions but delegates all financial calculations, debt-service ratios, and scheme evaluations to verified deterministic engines.
            </span>
          </div>
          <Badge variant="olive" size="sm" className="shrink-0">
            Audit-Trailed Logic
          </Badge>
        </div>

      </div>
    </section>
  );
};
