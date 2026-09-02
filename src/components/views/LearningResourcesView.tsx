/**
 * @license
 * GRAM-DISHA — Learning & Resource Vault
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Download, 
  ExternalLink, 
  Video, 
  HelpCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const LearningResourcesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'SCHEMES' | 'COMPLIANCE' | 'BANKING' | 'TRAINING'>('ALL');

  const resources = [
    {
      id: 'res_1',
      title: 'PMEGP Official Master Circular 2025-26',
      category: 'SCHEMES' as const,
      source: 'Ministry of MSME / KVIC',
      format: 'PDF Guide',
      size: '2.4 MB',
      description: 'Comprehensive guidelines on 35% rural capital subsidy, EDP training mandate, and negative list of industries.'
    },
    {
      id: 'res_2',
      title: 'FSSAI Food Safety Basic Registration Step-by-Step',
      category: 'COMPLIANCE' as const,
      source: 'Food Safety and Standards Authority of India',
      format: 'Interactive Tutorial',
      size: '15 Mins',
      description: 'How to file Form A online for ₹100/year petty food manufacturer registration for Dal and Spice mills.'
    },
    {
      id: 'res_3',
      title: 'Bank Manager Loan Appraisal Scoring Guide',
      category: 'BANKING' as const,
      source: 'Indian Banks Association (IBA)',
      format: 'Checklist & Guide',
      size: '1.8 MB',
      description: 'Understand Debt Service Coverage Ratio (DSCR), collateral norms under CGTMSE, and stock inspection criteria.'
    },
    {
      id: 'res_4',
      title: 'RSETI 10-Day Residential Entrepreneurship Training (EDP)',
      category: 'TRAINING' as const,
      source: 'Ministry of Rural Development (MoRD)',
      format: 'Course Curriculum',
      size: 'Free Program',
      description: 'Accredited training covering accounting, marketing, equipment maintenance, and team management.'
    },
    {
      id: 'res_5',
      title: 'PMFME One District One Product (ODOP) Master Guide',
      category: 'SCHEMES' as const,
      source: 'Ministry of Food Processing Industries (MoFPI)',
      format: 'Official Handbook',
      size: '3.1 MB',
      description: 'Detailed subsidy rules for individual micro-enterprises and SHG common facility centers.'
    }
  ];

  const filteredResources = selectedCategory === 'ALL'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  return (
    <div id="learning_resources_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Entrepreneur Learning & Statutory Resource Vault
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Official government gazette circulars, compliance walkthroughs, and credit appraisal handbooks.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'SCHEMES', 'COMPLIANCE', 'BANKING', 'TRAINING'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#174C3A] text-[#FCFAF5]'
                  : 'bg-[#FCFAF5] text-[#68655D] border border-[#D9D3C7] hover:bg-[#F8F5EE]'
              }`}
            >
              {cat === 'ALL' ? 'All Resources' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((res) => (
          <Card key={res.id} className="p-5 flex flex-col justify-between hover:border-[#174C3A]/50 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={res.category === 'SCHEMES' ? 'forest' : res.category === 'COMPLIANCE' ? 'terracotta' : 'harvest'} size="sm">
                  {res.category}
                </Badge>
                <span className="text-[11px] font-mono text-[#68655D]">{res.format} • {res.size}</span>
              </div>

              <h3 className="font-display font-bold text-base text-[#242522]">
                {res.title}
              </h3>

              <p className="text-xs text-[#68655D] leading-relaxed">
                {res.description}
              </p>

              <div className="text-[11px] text-[#174C3A] font-semibold">
                Authority: {res.source}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D9D3C7]/60 flex items-center justify-between">
              <span className="text-[11px] text-[#71856A] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Official
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => alert(`Accessing official publication: ${res.title}`)}
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Access Guide
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
