import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Layers, 
  Radar, 
  TrendingUp, 
  Truck, 
  Zap, 
  ShieldAlert, 
  Calendar,
  Database
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const MarketIntelligence: React.FC = () => {
  const { marketIntelligence } = LANDING_DATA;

  return (
    <section id="features" className="py-16 md:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={marketIntelligence.eyebrow}
          headline={marketIntelligence.headline}
          description={marketIntelligence.description}
          align="center"
          className="mb-14"
        />

        {/* Bento Grid: 5-10km Radius & Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: 5-10km Radius Visualization Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col"
          >
            <BentoCard variant="glass" className="flex-1 flex flex-col justify-between p-6 sm:p-8 space-y-6">
              
              {/* Header with illustrative badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#5A6B4F]/15 text-[#5A6B4F] flex items-center justify-center">
                    <Radar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#3B2F2A]">
                      5–10 km Economic Catchment Analysis
                    </h3>
                    <span className="text-[11px] text-[#3B2F2A]/60 font-editorial">
                      Analytical Planning View • Gram Panchayat & APMC Catchment
                    </span>
                  </div>
                </div>
                <Badge variant="gold" size="xs">Demonstration Data</Badge>
              </div>

              {/* Graphical Opportunity Field Representation */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/25 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#3B2F2A]/70 pb-2 border-b border-[#C8A96B]/20">
                  <span className="font-semibold">Catchment Layer</span>
                  <span className="font-mono">Scope & Logistics Radius</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#5A6B4F]/30 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5A6B4F]" />
                      <span className="font-semibold text-[#3B2F2A]">Inner Ring (0–3 km): Immediate Local Supply</span>
                    </div>
                    <span className="text-[11px] text-[#5A6B4F] font-mono font-bold">Farm-Gate Procurement</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/30 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C8A96B]" />
                      <span className="font-semibold text-[#3B2F2A]">Middle Ring (3–7 km): Processing & Weekly Haat</span>
                    </div>
                    <span className="text-[11px] text-[#6B5324] font-mono font-bold">Secondary APMC Catchment</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#B45B4A]/30 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B45B4A]" />
                      <span className="font-semibold text-[#3B2F2A]">Outer Ring (7–10 km): Semi-Urban Consumer Hub</span>
                    </div>
                    <span className="text-[11px] text-[#B45B4A] font-mono font-bold">Wholesale Mandi & Freight</span>
                  </div>
                </div>
              </div>

              {/* 4 Architectural Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                {marketIntelligence.features.map((feat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/20">
                    <span className="font-bold text-[#3B2F2A] block mb-1">{feat.title}</span>
                    <span className="text-[#3B2F2A]/70 leading-relaxed text-[11px]">{feat.desc}</span>
                  </div>
                ))}
              </div>

            </BentoCard>
          </motion.div>

          {/* Right: Live Signal Metadata Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <BentoCard variant="elevated" className="flex-1 flex flex-col justify-between p-6 sm:p-7 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#C8A96B]/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3B2F2A] uppercase tracking-wider">
                  <Database className="w-4 h-4 text-[#B45B4A]" />
                  <span>Signal Provenance & Confidence</span>
                </div>
                <Badge variant="olive" size="xs">LGD Verified</Badge>
              </div>

              <div className="space-y-3">
                {marketIntelligence.sampleSignals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/20 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#3B2F2A]/70">{sig.label}</span>
                      <span className="text-xs font-bold text-[#3B2F2A]">{sig.value}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#3B2F2A]/60 pt-1 border-t border-[#C8A96B]/15 font-mono">
                      <span>{sig.source}</span>
                      <span className="text-[#5A6B4F] font-bold">Conf: {sig.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Provenance Footer Note */}
              <div className="p-3 rounded-xl bg-[#F2E8D6]/60 border border-[#C8A96B]/30 text-[11px] text-[#3B2F2A]/80 leading-snug">
                <strong>Provenance Guarantee:</strong> Every price benchmark links to registered agricultural market registers with explicit data vintages and confidence ratings.
              </div>

            </BentoCard>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
