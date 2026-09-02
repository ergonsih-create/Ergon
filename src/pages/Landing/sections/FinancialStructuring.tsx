import React from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  Coins, 
  Wallet, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Percent, 
  CircleDollarSign,
  ReceiptText
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA } from '../data/landingContent';

export const FinancialStructuring: React.FC = () => {
  const { financialStructuring } = LANDING_DATA;

  const flowNodes = [
    'Project Cost',
    'Own Equity (10-15%)',
    'Term Loan (85%)',
    'Capital Subsidy (35%)',
    'Net Cash Flow',
    'Debt Service (DSCR)',
  ];

  return (
    <section id="finance" className="py-16 md:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={financialStructuring.eyebrow}
          headline={financialStructuring.headline}
          description={financialStructuring.description}
          align="center"
          className="mb-12"
        />

        {/* Deterministic Flow Visualization Sequence */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#C8A96B]/30 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {flowNodes.map((node, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-[#FAF7F2] border border-[#C8A96B]/25 flex-1 shadow-2xs">
                  <span className="text-[10px] font-mono text-[#B45B4A] font-bold">Stage 0{i + 1}</span>
                  <span className="text-xs font-bold text-[#3B2F2A] mt-0.5">{node}</span>
                </div>
                {i < flowNodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[#C8A96B] shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 6 Key Financial Structuring Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {financialStructuring.cards.map((card, idx) => (
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3B2F2A]/60">
                      {card.title}
                    </span>
                    <Badge variant="olive" size="xs">Deterministic</Badge>
                  </div>

                  <div className="text-2xl font-display font-bold text-[#3B2F2A]">
                    {card.value}
                  </div>

                  <p className="text-xs text-[#3B2F2A]/75 leading-relaxed font-sans pt-1">
                    {card.detail}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#C8A96B]/15 text-[10px] text-[#5A6B4F] font-mono font-semibold">
                  Standard Banking Formula Verified
                </div>
              </BentoCard>
            </motion.div>
          ))}
        </div>

        {/* Deterministic Calculation Guarantee Footer */}
        <div className="p-4 rounded-2xl bg-[#F2E8D6]/60 border border-[#C8A96B]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#3B2F2A]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#5A6B4F] shrink-0" />
            <span>{financialStructuring.note}</span>
          </div>
          <Badge variant="gold" size="sm" className="shrink-0">
            Bank Appraisal Ready
          </Badge>
        </div>

      </div>
    </section>
  );
};
