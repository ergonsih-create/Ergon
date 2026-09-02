import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  Calculator, 
  Landmark, 
  FileCheck, 
  Activity, 
  Store, 
  LineChart 
} from 'lucide-react';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const BusinessJourney: React.FC = () => {
  const { businessJourney } = LANDING_DATA;

  const stageIcons = [
    <Compass className="w-4 h-4 text-[#5A6B4F]" />,
    <Search className="w-4 h-4 text-[#C8A96B]" />,
    <TrendingUp className="w-4 h-4 text-[#B45B4A]" />,
    <CheckCircle2 className="w-4 h-4 text-[#5A6B4F]" />,
    <Calculator className="w-4 h-4 text-[#3B2F2A]" />,
    <Landmark className="w-4 h-4 text-[#5A6B4F]" />,
    <FileCheck className="w-4 h-4 text-[#C8A96B]" />,
    <Activity className="w-4 h-4 text-[#B45B4A]" />,
    <Store className="w-4 h-4 text-[#5A6B4F]" />,
    <LineChart className="w-4 h-4 text-[#C8A96B]" />,
  ];

  return (
    <section id="journey" className="py-16 md:py-24 bg-[#F2E8D6]/30 relative border-b border-[#C8A96B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={businessJourney.eyebrow}
          headline={businessJourney.headline}
          description={businessJourney.description}
          align="center"
          className="mb-14"
        />

        {/* 10-Stage Horizontal / Vertical Responsive Journey Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
          {businessJourney.stages.map((st, idx) => (
            <motion.div
              key={st.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/25 hover:border-[#B45B4A]/50 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#B45B4A]">
                  Stage {st.step}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#C8A96B]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {stageIcons[idx]}
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-[#3B2F2A]">
                  {st.name}
                </h3>
                <p className="text-[11px] text-[#3B2F2A]/70 leading-snug mt-1 font-sans">
                  {st.desc}
                </p>
              </div>

              <div className="w-full h-1 bg-[#E4D8C5] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#5A6B4F] rounded-full" 
                  style={{ width: `${(idx + 1) * 10}%` }} 
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
