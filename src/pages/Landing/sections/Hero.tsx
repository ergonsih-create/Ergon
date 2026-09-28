import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  Landmark, 
  CheckCircle2, 
  Compass,
  MapPin,
  FileCheck
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useLandingData } from '../data/landingContent';
import { useLanguage } from '../../../context/LanguageContext';

interface HeroProps {
  onStartJourney?: () => void;
  onExploreHowItWorks?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartJourney,
  onExploreHowItWorks,
}) => {
  const landingData = useLandingData();
  const { hero } = landingData;
  const { t, currentLanguage, isRTL } = useLanguage();

  const isLocalized = currentLanguage !== 'en';
  const displayEyebrow = hero.eyebrow;
  const displayHeadline = hero.headline;
  const displaySubtitle = hero.description;
  const displayPrimaryCta = hero.primaryCta;
  const displaySecondaryCta = hero.secondaryCta;

  return (
    <section 
      id="hero" 
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden"
    >
      {/* Soft Ambient Depth Accents - No Neon/Cyberpunk */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#F2E8D6]/60 via-[#FAF7F2]/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />
      <div className="absolute -top-24 right-10 w-80 h-80 bg-[#C8A96B]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Copy & Core CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#C8A96B]/40 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#5A6B4F] animate-pulse" />
              <span className="text-[12px] font-semibold tracking-wide text-[#3B2F2A] font-sans">
                {displayEyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-display font-bold text-[#3B2F2A] leading-[1.0] sm:leading-[1.02] lg:leading-[1.04] tracking-[-0.02em]">
              {currentLanguage === 'en' ? (
                <>
                  Build the right business.{' '}
                  <span className="text-[#B45B4A] italic font-editorial font-semibold block sm:inline">
                    With the right direction.
                  </span>
                </>
              ) : (
                <span className="whitespace-pre-line">{displayHeadline}</span>
              )}
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg lg:text-[19px] text-[#3B2F2A]/90 font-normal lg:font-[450] leading-[1.6] font-sans max-w-[650px]">
              {displaySubtitle}
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="terracotta"
                size="lg"
                onClick={onStartJourney}
                className="justify-center shadow-md hover:shadow-lg text-[15px] sm:text-[16px] font-semibold leading-[1.2] tracking-normal font-sans"
                icon={<ArrowRight className="w-4 h-4 ml-0.5 rtl:ml-0 rtl:mr-0.5 rtl-flip" />}
              >
                {displayPrimaryCta}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onExploreHowItWorks}
                className="justify-center text-[15px] sm:text-[16px] font-semibold leading-[1.2] tracking-normal font-sans"
              >
                {displaySecondaryCta}
              </Button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-4 border-t border-[#C8A96B]/20 flex flex-wrap items-center gap-y-2 gap-x-6 text-[13.5px] sm:text-[14px] font-medium text-[#3B2F2A]/90 tracking-normal font-sans">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5A6B4F] shrink-0" />
                <span>Deterministic Financial Math</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5A6B4F] shrink-0" />
                <span>5–10 km Opportunity Field</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5A6B4F] shrink-0" />
                <span>Official Scheme Rules</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Premium Disha Intelligence Visual Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Glass Intelligence Panel */}
            <div className="glass-panel-disha rounded-3xl p-5 sm:p-7 relative overflow-hidden">
              
              {/* Top Bar: Disha Status & Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C8A96B]/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#5A6B4F] text-[#FAF7F2] flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#C8A96B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-bold text-[15px] text-[#3B2F2A]">Disha</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#5A6B4F]/15 text-[#2E3C27] font-semibold border border-[#5A6B4F]/35 uppercase tracking-wide leading-none font-sans">
                        AI OS
                      </span>
                    </div>
                    <span className="text-[11.5px] text-[#3B2F2A]/75 block font-sans font-medium">
                      Intelligence & Orchestration Layer
                    </span>
                  </div>
                </div>

                <Badge variant="gold" size="xs" className="text-[11.5px] font-semibold">
                  {hero.demoBadge}
                </Badge>
              </div>

              {/* Disha Thought / Greeting Speech Bubble */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2]/90 border border-[#C8A96B]/25 mb-4 space-y-1">
                <div className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#3B2F2A] leading-snug font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A6B4F]" />
                  <span>{hero.dishaGreeting}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#3B2F2A]/85 font-medium leading-snug font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#B45B4A] shrink-0" />
                  <span>{hero.dishaContext}</span>
                </div>
              </div>

              {/* 4 Multi-Module Intelligence Insight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {hero.insightCards.map((card, idx) => {
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/20 hover:border-[#C8A96B]/50 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[12px] sm:text-[12.5px] font-semibold text-[#3B2F2A]/85 uppercase tracking-[0.04em] leading-[1.3] font-sans">
                          {card.title}
                        </span>
                        <Badge variant={card.badgeType} size="xs" className="text-[11px] font-semibold shrink-0">
                          {card.status}
                        </Badge>
                      </div>
                      <p className="text-[14px] text-[#3B2F2A] font-medium leading-[1.45] font-sans">
                        {card.detail}
                      </p>
                      {card.source && (
                        <span className="text-[11px] text-[#3B2F2A]/75 font-normal sm:font-medium leading-[1.4] block font-sans">
                          Source: {card.source}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Operational Action Line */}
              <div className="pt-3 border-t border-[#C8A96B]/20 flex items-center justify-between text-[12.5px] font-sans">
                <div className="flex items-center gap-2 text-[#3B2F2A]/85 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#5A6B4F] shrink-0" />
                  <span>Deterministic Audit Trail Verified</span>
                </div>
                <span className="text-[11.5px] text-[#B45B4A] font-semibold cursor-pointer hover:underline">
                  Review Mathematical Model →
                </span>
              </div>

            </div>

            {/* Floating Soft Badge Decoration */}
            <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 shadow-lg">
              <div className="w-7 h-7 rounded-lg bg-[#B45B4A]/15 text-[#B45B4A] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left pr-2 font-sans">
                <span className="text-[11px] uppercase font-semibold text-[#3B2F2A]/75 tracking-wider block">HBFS Feasibility</span>
                <span className="text-[13px] font-bold text-[#3B2F2A]">0.78 Bankable Tier</span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
