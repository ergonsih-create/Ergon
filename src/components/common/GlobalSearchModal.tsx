/**
 * @license
 * GRAM-DISHA — Global Search & Command Palette Modal
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Provides instant search across 30 application screens, curated business ideas,
 * government subsidy schemes, learning modules, and support topics.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Compass, 
  Lightbulb, 
  Landmark, 
  BookOpen, 
  HelpCircle, 
  Calculator, 
  Boxes, 
  TrendingUp, 
  FileText, 
  Sparkles,
  Command
} from 'lucide-react';
import { useDisha } from '../../context/DishaContext';
import { useLanguage } from '../../context/LanguageContext';
import { CURATED_BUSINESS_TEMPLATES } from '../../data/sampleBusinesses';
import { DishaContextState } from '../../types';

interface SearchResultItem {
  id: string;
  type: 'MODULE' | 'BUSINESS_IDEA' | 'SCHEME' | 'LEARNING' | 'FAQ';
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  moduleToOpen: DishaContextState['currentModule'];
}

export const GlobalSearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { setModule } = useDisha();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Search Catalog
  const allResults: SearchResultItem[] = [
    // Modules
    {
      id: 'mod_dashboard',
      type: 'MODULE',
      title: 'Executive Dashboard & Business Health',
      description: 'Overview of feasibility, financial outlay, and scheme status',
      category: 'Navigation',
      icon: <Compass className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'DASHBOARD'
    },
    {
      id: 'mod_ideas',
      type: 'MODULE',
      title: 'Business Idea & Requirements Evaluator',
      description: 'Configure proposed enterprise sector, location, and raw material inputs',
      category: 'Navigation',
      icon: <Lightbulb className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'BUSINESS_IDEAS'
    },
    {
      id: 'mod_market',
      type: 'MODULE',
      title: 'Hyper-Local Market & Commodity Insights',
      description: 'Demand-supply gap, nearby markets, and ODOP agricultural commodities',
      category: 'Navigation',
      icon: <TrendingUp className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'MARKET_INSIGHTS'
    },
    {
      id: 'mod_feasibility',
      type: 'MODULE',
      title: 'Feasibility Matrix & SWOT Analysis',
      description: 'HBFS 8-Factor feasibility index, viability, and scalability score',
      category: 'Navigation',
      icon: <Compass className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'FEASIBILITY'
    },
    {
      id: 'mod_finance',
      type: 'MODULE',
      title: 'Financial Workspace & Loan Amortizer',
      description: 'CAPEX, OPEX, DSCR, cash flow projection, and EMI calculation',
      category: 'Navigation',
      icon: <Calculator className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'FINANCE'
    },
    {
      id: 'mod_schemes',
      type: 'MODULE',
      title: 'Government Schemes & Subsidy Matcher',
      description: 'PMEGP, PMFME, Mudra, Stand-Up India, and SHG subsidy rules',
      category: 'Navigation',
      icon: <Landmark className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'SCHEMES'
    },
    {
      id: 'mod_dpr',
      type: 'MODULE',
      title: 'Bankable DPR & Application Dossier',
      description: 'Generate statutory Detailed Project Reports and track DIC filings',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'APPLICATIONS'
    },
    {
      id: 'mod_operations',
      type: 'MODULE',
      title: 'Inventory, Stock Alerts & Sales Tracker',
      description: 'Log daily raw material stock, reorder thresholds, and customer sales',
      category: 'Navigation',
      icon: <Boxes className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'INVENTORY'
    },
    {
      id: 'mod_learning',
      type: 'MODULE',
      title: 'Learning Hub & Financial Literacy',
      description: 'Statutory compliance guides, FSSAI, GST rules, and video tutorials',
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'LEARNING'
    },
    {
      id: 'mod_support',
      type: 'MODULE',
      title: 'Help Desk, Escalation & Grievance Portal',
      description: 'Raise tickets with DIC facilitators and track resolution timeline',
      category: 'Navigation',
      icon: <HelpCircle className="w-4 h-4 text-[#174C3A]" />,
      moduleToOpen: 'SUPPORT'
    },

    // Curated Business Ideas
    ...CURATED_BUSINESS_TEMPLATES.map(tmpl => ({
      id: `tmpl_${tmpl.context.id}`,
      type: 'BUSINESS_IDEA' as const,
      title: tmpl.context.title,
      description: `${tmpl.context.category} • ₹${(tmpl.defaultFinancials.projectCost / 100000).toFixed(1)}L Total Cost`,
      category: 'Curated Template',
      icon: <Lightbulb className="w-4 h-4 text-[#C69A45]" />,
      moduleToOpen: 'BUSINESS_IDEAS' as const
    })),

    // Common Subsidy Schemes
    {
      id: 'scheme_pmegp',
      type: 'SCHEME',
      title: 'PMEGP — Prime Minister Employment Generation Programme',
      description: 'Up to 35% capital margin money subsidy for rural manufacturing/service units',
      category: 'Subsidy Scheme',
      icon: <Landmark className="w-4 h-4 text-[#5A6B4F]" />,
      moduleToOpen: 'SCHEMES'
    },
    {
      id: 'scheme_pmfme',
      type: 'SCHEME',
      title: 'PMFME — Micro Food Processing Enterprises Scheme',
      description: '35% credit-linked capital subsidy up to ₹10 Lakhs for food processing',
      category: 'Subsidy Scheme',
      icon: <Landmark className="w-4 h-4 text-[#5A6B4F]" />,
      moduleToOpen: 'SCHEMES'
    },
    {
      id: 'scheme_mudra',
      type: 'SCHEME',
      title: 'Pradhan Mantri MUDRA Yojana (Shishu, Kishor, Tarun)',
      description: 'Collateral-free micro loans up to ₹10 Lakhs with low interest rates',
      category: 'Subsidy Scheme',
      icon: <Landmark className="w-4 h-4 text-[#5A6B4F]" />,
      moduleToOpen: 'SCHEMES'
    },

    // Learning
    {
      id: 'learn_dscr',
      type: 'LEARNING',
      title: 'Understanding Debt Service Coverage Ratio (DSCR)',
      description: 'Why banks require DSCR > 1.35 for sanctioning rural business loans',
      category: 'Financial Literacy',
      icon: <BookOpen className="w-4 h-4 text-[#B45B4A]" />,
      moduleToOpen: 'LEARNING'
    },
    {
      id: 'learn_fssai',
      type: 'LEARNING',
      title: 'FSSAI Food Safety Registration for Agro Processing',
      description: 'Step-by-step registration for small food processing & packaging units',
      category: 'Statutory Compliance',
      icon: <BookOpen className="w-4 h-4 text-[#B45B4A]" />,
      moduleToOpen: 'LEARNING'
    }
  ];

  const filteredResults = query.trim() === ''
    ? allResults.slice(0, 8)
    : allResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (item: SearchResultItem) => {
    setModule(item.moduleToOpen);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3B2F2A]/60 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-20 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#C8A96B]/50 overflow-hidden flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-[#C8A96B]/25 flex items-center gap-3 bg-[#F2E8D6]/40">
          <Search className="w-5 h-5 text-[#174C3A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search screens, schemes, business ideas, DSCR, FSSAI..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#3B2F2A] focus:outline-none placeholder:text-[#3B2F2A]/50"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-[#C8A96B]/20 text-[#3B2F2A]/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg border border-[#C8A96B]/40 text-xs font-mono font-bold text-[#3B2F2A]/70 hover:bg-[#F2E8D6] transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-[#C8A96B]/10">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-[#3B2F2A]/60">
              <Sparkles className="w-8 h-8 mx-auto text-[#C8A96B] mb-2" />
              <p className="text-sm font-bold">No results found for "{query}"</p>
              <p className="text-xs text-[#3B2F2A]/60 mt-1">Try searching for "PMEGP", "Feasibility", "Finance", or "Inventory".</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-[#174C3A] text-[#FAF7F2] shadow-xs' : 'hover:bg-[#F2E8D6]/60 text-[#3B2F2A]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#FAF7F2]/20' : 'bg-[#F2E8D6]'
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold">{item.title}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full uppercase font-bold ${
                          isSelected ? 'bg-[#C8A96B]/30 text-[#FAF7F2]' : 'bg-[#174C3A]/10 text-[#174C3A]'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-[#FAF7F2]/80' : 'text-[#3B2F2A]/70'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#C8A96B]' : 'text-[#3B2F2A]/40'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[#F2E8D6]/40 border-t border-[#C8A96B]/20 text-[11px] text-[#3B2F2A]/60 flex items-center justify-between px-4 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#C8A96B]/30">↑</kbd> <kbd className="bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#C8A96B]/30">↓</kbd> Navigate</span>
            <span><kbd className="bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#C8A96B]/30">↵</kbd> Select</span>
          </div>
          <div>
            Gram-Disha Global Command Search
          </div>
        </div>
      </div>
    </div>
  );
};
