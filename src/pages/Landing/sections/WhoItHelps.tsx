import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Store, 
  Sparkles, 
  Tractor, 
  Wrench, 
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const WhoItHelps: React.FC = () => {
  const { whoItHelps } = LANDING_DATA;

  const cohortIcons = [
    <Users className="w-5 h-5 text-[#5A6B4F]" />,
    <Store className="w-5 h-5 text-[#C8A96B]" />,
    <Sparkles className="w-5 h-5 text-[#B45B4A]" />,
    <Tractor className="w-5 h-5 text-[#5A6B4F]" />,
    <Wrench className="w-5 h-5 text-[#3B2F2A]" />,
    <TrendingUp className="w-5 h-5 text-[#C8A96B]" />,
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={whoItHelps.eyebrow}
          headline={whoItHelps.headline}
          description={whoItHelps.description}
          align="center"
          className="mb-14"
        />

        {/* 6 Cohort Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whoItHelps.cohorts.map((cohort, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <BentoCard
                variant="glass"
                className="h-full flex flex-col justify-between p-6 border-[#C8A96B]/25 hover:border-[#5A6B4F]/40"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/30 flex items-center justify-center shadow-2xs">
                      {cohortIcons[idx]}
                    </div>
                    <Badge variant="olive" size="xs">
                      {cohort.tag}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-[#3B2F2A]">
                      {cohort.title}
                    </h3>
                    <span className="text-[11px] text-[#5A6B4F] font-semibold block mt-0.5">
                      {cohort.persona}
                    </span>
                  </div>

                  <p className="text-xs text-[#3B2F2A]/75 leading-relaxed font-sans">
                    {cohort.situation}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#C8A96B]/20 space-y-1">
                  <span className="text-[10px] font-bold text-[#3B2F2A]/60 uppercase tracking-wider block">
                    Tailored Outcome:
                  </span>
                  <div className="flex items-start gap-1.5 text-xs text-[#3B2F2A] font-medium leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B4F] shrink-0 mt-0.5" />
                    <span>{cohort.benefit}</span>
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
