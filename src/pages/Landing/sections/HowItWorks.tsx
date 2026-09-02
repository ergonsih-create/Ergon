import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  MapPin, 
  TrendingUp, 
  Calculator, 
  Landmark, 
  Rocket, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const HowItWorks: React.FC = () => {
  const { howItWorks } = LANDING_DATA;
  const [selectedStep, setSelectedStep] = useState(0);

  const stepIcons = [
    <UserCheck className="w-5 h-5 text-[#5A6B4F]" />,
    <MapPin className="w-5 h-5 text-[#C8A96B]" />,
    <TrendingUp className="w-5 h-5 text-[#B45B4A]" />,
    <Calculator className="w-5 h-5 text-[#3B2F2A]" />,
    <Landmark className="w-5 h-5 text-[#5A6B4F]" />,
    <Rocket className="w-5 h-5 text-[#B45B4A]" />,
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#F2E8D6]/20 relative border-b border-[#C8A96B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={howItWorks.eyebrow}
          headline={howItWorks.headline}
          description={howItWorks.description}
          align="center"
          className="mb-14"
        />

        {/* 6-Step Visual Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {howItWorks.steps.map((step, idx) => {
            const isSelected = selectedStep === idx;
            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedStep(idx)}
                className="cursor-pointer"
              >
                <BentoCard
                  variant={isSelected ? 'elevated' : 'glass'}
                  className={`h-full flex flex-col justify-between p-6 transition-all duration-300 ${
                    isSelected ? 'border-[#B45B4A] shadow-md ring-1 ring-[#B45B4A]/30' : 'hover:border-[#C8A96B]/50'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/35 flex items-center justify-center shadow-2xs">
                          {stepIcons[idx]}
                        </div>
                        <span className="text-xs font-mono font-bold text-[#B45B4A] uppercase tracking-wider">
                          Step {step.stepNumber}
                        </span>
                      </div>
                      <Badge variant="neutral" size="xs">
                        {step.category}
                      </Badge>
                    </div>

                    {/* Step Title & Description */}
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#3B2F2A]">
                        {step.title}
                      </h3>
                      <p className="text-xs text-[#3B2F2A]/75 mt-1.5 leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>

                    {/* Deliverable Outputs List */}
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/20 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#3B2F2A]/60 uppercase tracking-wider block">
                        Deterministic Outputs:
                      </span>
                      <ul className="space-y-1">
                        {step.keyOutputs.map((out, outIdx) => (
                          <li key={outIdx} className="flex items-center gap-1.5 text-xs text-[#3B2F2A] font-medium">
                            <CheckCircle2 className="w-3 h-3 text-[#5A6B4F] shrink-0" />
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Action Summary Footer */}
                  <div className="pt-3 mt-4 border-t border-[#C8A96B]/20 flex items-center justify-between text-[11px] text-[#5A6B4F] font-semibold">
                    <span>{step.actionSummary}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />
                  </div>

                </BentoCard>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
