import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Unlink, 
  Link2,
  Workflow
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const Solution: React.FC = () => {
  const { solution } = LANDING_DATA;

  return (
    <section id="solution" className="py-16 md:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={solution.eyebrow}
          headline={solution.headline}
          description={solution.description}
          align="center"
          className="mb-14"
        />

        {/* Transformation Visual Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Before: Fragmented Journey */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#B45B4A]/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#B45B4A]/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B45B4A] uppercase tracking-wider">
                  <Unlink className="w-4 h-4" />
                  <span>The Fragmented Old Way</span>
                </div>
                <Badge variant="terracotta" size="xs">Disconnected</Badge>
              </div>

              <div className="space-y-2.5">
                {solution.fragmentedPoints.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-dashed border-[#B45B4A]/30 flex items-center justify-between text-xs text-[#3B2F2A]/80"
                  >
                    <span>{item}</span>
                    <span className="text-[10px] text-[#B45B4A] font-mono">Isolated Step</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Central Transformation Bridge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col items-center justify-center text-center py-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#3B2F2A] text-[#FAF7F2] flex items-center justify-center shadow-md border border-[#C8A96B] mb-2">
              <Workflow className="w-6 h-6 text-[#C8A96B]" />
            </div>
            <span className="text-xs font-display font-bold text-[#3B2F2A] uppercase tracking-wider">
              Gram-Disha Engine
            </span>
            <span className="text-[10px] text-[#5A6B4F] font-semibold mt-0.5">
              Unifies All Layers
            </span>
          </motion.div>

          {/* After: One Connected Business Journey */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="p-6 rounded-3xl glass-panel-elevated border-[#5A6B4F]/40 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-[#5A6B4F]/25">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5A6B4F] uppercase tracking-wider">
                  <Link2 className="w-4 h-4" />
                  <span>One Connected Business Journey</span>
                </div>
                <Badge variant="olive" size="xs">Integrated</Badge>
              </div>

              <div className="space-y-2.5">
                {solution.connectedPoints.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#5A6B4F]/30 flex items-center justify-between text-xs text-[#3B2F2A] font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B4F]" />
                      <span>{item}</span>
                    </div>
                    <span className="text-[10px] text-[#5A6B4F] font-mono font-semibold">Active Sync</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
