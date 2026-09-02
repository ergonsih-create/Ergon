import React from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, 
  Coins, 
  Wallet, 
  Landmark, 
  FileQuestion, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const Problem: React.FC = () => {
  const { problem } = LANDING_DATA;

  const iconMap: Record<string, React.ReactNode> = {
    HelpCircle: <HelpCircle className="w-5 h-5 text-[#B45B4A]" />,
    Coins: <Coins className="w-5 h-5 text-[#B45B4A]" />,
    Wallet: <Wallet className="w-5 h-5 text-[#B45B4A]" />,
    Landmark: <Landmark className="w-5 h-5 text-[#B45B4A]" />,
    FileQuestion: <FileQuestion className="w-5 h-5 text-[#B45B4A]" />,
    Compass: <Compass className="w-5 h-5 text-[#B45B4A]" />,
  };

  return (
    <section id="problem" className="py-16 md:py-24 bg-[#F2E8D6]/35 relative border-y border-[#C8A96B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={problem.eyebrow}
          headline={problem.headline}
          description={problem.description}
          align="center"
          className="mb-14"
        />

        {/* 6 Problem Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problem.cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <BentoCard
                variant="default"
                className="h-full flex flex-col justify-between p-6 border-[#B45B4A]/20 hover:border-[#B45B4A]/50 bg-[#FAF7F2]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#B45B4A]/10 flex items-center justify-center">
                      {iconMap[card.icon]}
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#B45B4A] px-2 py-0.5 rounded-md bg-[#B45B4A]/10">
                      {card.issue}
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-[#3B2F2A] italic leading-snug">
                    {card.question}
                  </h3>

                  <p className="text-xs text-[#3B2F2A]/75 leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#C8A96B]/20 flex items-center gap-1.5 text-[11px] text-[#B45B4A] font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Causes operational drop-off & delayed launch</span>
                </div>
              </BentoCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
