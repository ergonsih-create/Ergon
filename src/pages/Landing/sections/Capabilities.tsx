import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Search,
  Filter
} from 'lucide-react';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Badge } from '../../../components/ui/Badge';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { LANDING_DATA, CapabilityItem } from '../data/landingContent';

export const Capabilities: React.FC = () => {
  const { capabilities } = LANDING_DATA;
  const [filter, setFilter] = useState<'ALL' | 'MARKET' | 'FINANCE' | 'SCHEMES' | 'OPERATIONS' | 'INTELLIGENCE'>('ALL');

  const filteredItems = capabilities.items.filter((it) => {
    if (filter === 'ALL') return true;
    return it.category === filter;
  });

  return (
    <section id="capabilities" className="py-16 md:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={capabilities.eyebrow}
          headline={capabilities.headline}
          description={capabilities.description}
          align="center"
          className="mb-10"
        />

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {(['ALL', 'MARKET', 'FINANCE', 'SCHEMES', 'OPERATIONS', 'INTELLIGENCE'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#3B2F2A] text-[#FAF7F2] shadow-xs'
                  : 'bg-[#F2E8D6]/60 text-[#3B2F2A]/75 hover:bg-[#F2E8D6] border border-[#C8A96B]/25'
              }`}
            >
              {cat === 'ALL' ? 'All 18 Capabilities' : cat}
            </button>
          ))}
        </div>

        {/* 18 Capabilities Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
            >
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all h-full flex flex-col justify-between ${
                  item.isAiOs
                    ? 'bg-[#F2E8D6]/40 border-[#5A6B4F]/40 hover:border-[#5A6B4F] shadow-xs'
                    : 'bg-[#FAF7F2] border-[#C8A96B]/20 hover:border-[#B45B4A]/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#B45B4A]">
                      #{item.id < 10 ? `0${item.id}` : item.id}
                    </span>
                    <Badge variant={item.isAiOs ? 'olive' : 'neutral'} size="xs">
                      {item.category}
                    </Badge>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-[#3B2F2A]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#3B2F2A]/75 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 mt-3 border-t border-[#C8A96B]/15 flex items-center gap-1.5 text-[10px] text-[#5A6B4F] font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-[#5A6B4F] shrink-0" />
                  <span>Production Ready</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
