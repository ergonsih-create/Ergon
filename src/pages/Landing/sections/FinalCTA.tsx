import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LANDING_DATA } from '../data/landingContent';

interface FinalCTAProps {
  onStartWithDisha?: () => void;
  onExplorePlatform?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  onStartWithDisha,
  onExplorePlatform,
}) => {
  const { finalCta } = LANDING_DATA;

  return (
    <section className="py-20 md:py-28 bg-[#3B2F2A] text-[#FAF7F2] relative overflow-hidden">
      {/* Background Subtle Heritage Gold Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8A96B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2]/10 border border-[#C8A96B]/30 text-xs font-semibold text-[#C8A96B]">
          <Compass className="w-3.5 h-3.5" />
          <span>{finalCta.eyebrow}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#FAF7F2] leading-tight">
          {finalCta.headline}
        </h2>

        <p className="text-base sm:text-lg text-[#FAF7F2]/80 leading-relaxed font-sans max-w-2xl mx-auto font-editorial sm:font-sans">
          {finalCta.subhead}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Button
            variant="gold"
            size="lg"
            onClick={onStartWithDisha}
            className="w-full sm:w-auto shadow-lg hover:shadow-xl text-base font-bold"
            icon={<ArrowRight className="w-4 h-4 ml-0.5" />}
          >
            {finalCta.primaryCta}
          </Button>

          <Button
            variant="glass"
            size="lg"
            onClick={onExplorePlatform}
            className="w-full sm:w-auto text-base text-[#FAF7F2] bg-[#FAF7F2]/10 border-[#C8A96B]/30 hover:bg-[#FAF7F2]/20"
          >
            {finalCta.secondaryCta}
          </Button>
        </div>

        <div className="pt-6 border-t border-[#C8A96B]/20 text-xs text-[#FAF7F2]/60 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C8A96B]" />
          <span>{finalCta.guaranteeNote}</span>
        </div>

      </div>
    </section>
  );
};
