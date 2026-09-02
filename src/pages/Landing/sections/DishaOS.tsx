import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  LayoutDashboard, 
  TrendingUp, 
  Calculator, 
  Landmark, 
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const DishaOS: React.FC = () => {
  const { dishaOS } = LANDING_DATA;
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  const workflowIcons = [
    <LayoutDashboard className="w-4 h-4 text-[#5A6B4F]" />,
    <TrendingUp className="w-4 h-4 text-[#C8A96B]" />,
    <Calculator className="w-4 h-4 text-[#B45B4A]" />,
    <Landmark className="w-4 h-4 text-[#5A6B4F]" />,
    <FileCheck className="w-4 h-4 text-[#3B2F2A]" />,
  ];

  return (
    <section id="disha-os" className="py-16 md:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={dishaOS.eyebrow}
          headline={dishaOS.headline}
          description={dishaOS.description}
          align="center"
          className="mb-14"
        />

        {/* Disha Central Intelligence & Workflow Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Workflow Module Triggers */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3B2F2A]/60 block px-1">
              Contextual Intelligence Triggers
            </span>

            {dishaOS.workflows.map((wf, idx) => {
              const isActive = activeWorkflow === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveWorkflow(idx)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FAF7F2] border-[#B45B4A] shadow-md ring-1 ring-[#B45B4A]/30'
                      : 'bg-[#FAF7F2] border-[#C8A96B]/20 hover:border-[#C8A96B]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#C8A96B]/30 flex items-center justify-center">
                        {workflowIcons[idx]}
                      </div>
                      <span className="font-display font-bold text-sm text-[#3B2F2A]">
                        {wf.location}
                      </span>
                    </div>
                    {isActive && (
                      <Badge variant="terracotta" size="xs">Active View</Badge>
                    )}
                  </div>

                  <div className="text-xs text-[#3B2F2A]/70 pl-9">
                    <span className="font-semibold text-[#3B2F2A]/90">Trigger:</span> {wf.trigger}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Disha Orchestration Card */}
          <div className="lg:col-span-6 flex flex-col">
            <motion.div
              key={activeWorkflow}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1"
            >
              <BentoCard
                variant="disha"
                className="h-full flex flex-col justify-between p-7 sm:p-8 space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#5A6B4F]/25">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#5A6B4F] text-[#FAF7F2] flex items-center justify-center shadow-xs">
                        <Sparkles className="w-5 h-5 text-[#C8A96B]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-bold text-base text-[#3B2F2A]">Disha Advisory</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#5A6B4F]/15 text-[#5A6B4F] font-semibold uppercase">
                            Live Orchestrator
                          </span>
                        </div>
                        <span className="text-[11px] text-[#3B2F2A]/60 font-editorial">
                          Module: {dishaOS.workflows[activeWorkflow].location}
                        </span>
                      </div>
                    </div>
                    <Badge variant="olive" size="xs">Cross-Module Sync</Badge>
                  </div>

                  {/* Context State */}
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#5A6B4F]/25 space-y-1">
                    <span className="text-[10px] font-bold text-[#5A6B4F] uppercase tracking-wider block">
                      Observed Environmental State
                    </span>
                    <p className="text-xs text-[#3B2F2A] font-medium">
                      {dishaOS.workflows[activeWorkflow].trigger}
                    </p>
                  </div>

                  {/* Disha Thought & Action Guidance */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3B2F2A]">
                      <span className="w-2 h-2 rounded-full bg-[#5A6B4F] animate-pulse" />
                      <span>Disha Guidance:</span>
                    </div>
                    <p className="text-sm text-[#3B2F2A] leading-relaxed font-editorial">
                      {dishaOS.workflows[activeWorkflow].dishaAction}
                    </p>
                  </div>
                </div>

                {/* Footer Assurance */}
                <div className="pt-4 border-t border-[#5A6B4F]/20 flex items-center justify-between text-xs text-[#3B2F2A]/70">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#5A6B4F]" />
                    <span>No Hallucinations • Auditable Actions</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#B45B4A] hover:underline cursor-pointer">
                    Apply Guidance →
                  </span>
                </div>
              </BentoCard>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};
