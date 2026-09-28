/**
 * @license
 * GRAM-DISHA — Learning & Statutory Resource Vault View
 * Team ERGON — Smart India Hackathon 2026
 */

import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ApiClient } from '../../services/api/apiClient';

export const LearningResourcesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'SCHEMES' | 'COMPLIANCE' | 'BANKING' | 'TRAINING'>('ALL');
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const cat = selectedCategory === 'ALL' ? undefined : selectedCategory;
      const res = await ApiClient.getLearningResources(cat);
      if (res.status === 'SUCCESS' && Array.isArray(res.data)) {
        setResources(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

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
        {resources.map((res) => (
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
                onClick={() => {
                  if (res.url && res.url !== '#') {
                    window.open(res.url, '_blank');
                  } else {
                    alert(`Accessing official publication: ${res.title} from ${res.source}`);
                  }
                }}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                Access Guide
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
