/**
 * @license
 * GRAM-DISHA — Curated Business Models & Idea Explorer
 */

import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  Check, 
  Layers, 
  Wrench, 
  AlertTriangle, 
  Users, 
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingUp,
  Landmark,
  FileCheck2,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDisha } from '../../context/DishaContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CURATED_BUSINESS_TEMPLATES, BusinessTemplate } from '../../data/sampleBusinesses';
import { DishaContextState } from '../../types';

export const BusinessIdeasView: React.FC<{ onNavigate?: (mod: DishaContextState['currentModule']) => void }> = ({ onNavigate }) => {
  const { activeBusiness, switchBusinessTemplate } = useAuth();
  const { openAdvisorWithInsight } = useDisha();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTemplateModal, setSelectedTemplateModal] = useState<BusinessTemplate | null>(null);

  const categories = ['ALL', 'Agro-Processing & Value Addition', 'Organic Agriculture & Bio-Inputs'];

  const filteredTemplates = CURATED_BUSINESS_TEMPLATES.filter((tmpl) => {
    const matchesSearch = tmpl.context.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.context.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.context.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || tmpl.context.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: BusinessTemplate) => {
    switchBusinessTemplate(template.context.id);
    openAdvisorWithInsight(
      `Activated ${template.context.title}. All financial structures, schemes, and feasibility matrices have been synchronized.`,
      [],
      'Proceed to Financial Structuring to customize project cost or view Loan EMI calculations.'
    );
  };

  return (
    <div id="business_ideas_view" className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xl sm:text-2xl text-[#242522]">
              Curated Rural Enterprise Models
            </span>
            <Badge variant="forest">Evidence-Verified</Badge>
          </div>
          <p className="text-xs text-[#68655D] mt-1">
            Pre-configured, bankable micro-enterprise models backed by NABARD sectoral benchmarks and PMEGP capital subsidy matrices.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#68655D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by activity, machinery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-[#D9D3C7] bg-[#FCFAF5] text-xs text-[#242522] focus:outline-none focus:ring-2 focus:ring-[#174C3A]/30 w-full sm:w-64"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#174C3A] text-[#FCFAF5]'
                    : 'bg-[#FCFAF5] text-[#68655D] border border-[#D9D3C7] hover:bg-[#F8F5EE]'
                }`}
              >
                {cat === 'ALL' ? 'All Sectors' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Business Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          const isActive = activeBusiness.id === template.context.id;
          const costLakh = (template.defaultFinancials.projectCost / 100000).toFixed(2);
          const promoterLakh = (template.defaultFinancials.promoterCapital / 100000).toFixed(2);

          return (
            <Card
              key={template.context.id}
              id={`biz_card_${template.context.id}`}
              className={`p-6 flex flex-col justify-between transition-all ${
                isActive ? 'border-2 border-[#174C3A] bg-[#FCFAF5] shadow-md' : 'hover:border-[#D9D3C7] hover:shadow-xs'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="terracotta" size="sm">{template.context.category}</Badge>
                      <Badge variant="neutral" size="sm">{template.context.scale} Scale</Badge>
                      {isActive && (
                        <Badge variant="forest" size="sm" className="flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active Enterprise
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#242522] mt-2">
                      {template.context.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#174C3A]/10 text-[#174C3A] flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-[#68655D] leading-relaxed">
                  {template.context.description}
                </p>

                {/* Key Financial Snapshot */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#F8F5EE] rounded-2xl border border-[#D9D3C7]/60 text-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#68655D]">Est. Project Cost</div>
                    <div className="text-sm font-extrabold text-[#242522] mt-0.5">₹{costLakh} Lakh</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#68655D]">Promoter Equity</div>
                    <div className="text-sm font-extrabold text-[#174C3A] mt-0.5">₹{promoterLakh} Lakh</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#68655D]">Max PMEGP Subsidy</div>
                    <div className="text-sm font-extrabold text-[#B95736] mt-0.5">35% Rural</div>
                  </div>
                </div>

                {/* Machinery & Sourcing Highlights */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#242522] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#174C3A]" />
                    Key Equipment Required:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {template.equipmentRequired.slice(0, 3).map((eq, i) => (
                      <span key={i} className="text-[11px] bg-[#FCFAF5] border border-[#D9D3C7] text-[#242522] px-2.5 py-1 rounded-lg">
                        {eq}
                      </span>
                    ))}
                    {template.equipmentRequired.length > 3 && (
                      <span className="text-[11px] text-[#68655D] self-center">
                        +{template.equipmentRequired.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-[#D9D3C7]/60 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplateModal(template)}
                  className="text-xs"
                >
                  View Full Bill of Materials
                </Button>

                {isActive ? (
                  <Button
                    variant="forest"
                    size="sm"
                    className="text-xs"
                    onClick={() => onNavigate && onNavigate('FINANCE')}
                  >
                    Open Financials
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    variant="terracotta"
                    size="sm"
                    onClick={() => handleSelectTemplate(template)}
                    className="text-xs"
                  >
                    Select This Enterprise
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal: Full Bill of Materials & Technical Specs */}
      {selectedTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFAF5] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#D9D3C7] space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="terracotta">{selectedTemplateModal.context.category}</Badge>
                <h2 className="font-display font-bold text-xl text-[#242522] mt-1.5">
                  {selectedTemplateModal.context.title}
                </h2>
                <p className="text-xs text-[#68655D] mt-1">
                  NABARD & KVIC Technical Specification Matrix
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplateModal(null)}
                className="w-8 h-8 rounded-full bg-[#F8F5EE] border border-[#D9D3C7] flex items-center justify-center text-xs font-bold text-[#68655D] hover:bg-[#D9D3C7]"
              >
                ✕
              </button>
            </div>

            {/* Detailed Project Cost Breakdown Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#242522] uppercase tracking-wider">
                Capital Cost Breakdown (₹)
              </h4>
              <div className="border border-[#D9D3C7] rounded-2xl overflow-hidden bg-[#F8F5EE]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#EFEAE1] text-[#242522] font-semibold border-b border-[#D9D3C7]">
                    <tr>
                      <th className="p-3">Cost Component</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9D3C7]/60">
                    <tr>
                      <td className="p-3 text-[#242522]">Plant & Industrial Machinery</td>
                      <td className="p-3 text-right font-mono font-semibold">₹{selectedTemplateModal.defaultFinancials.customBreakdown?.equipmentAndMachinery?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-[#242522]">Civil Works & Shed Infrastructure</td>
                      <td className="p-3 text-right font-mono font-semibold">₹{selectedTemplateModal.defaultFinancials.customBreakdown?.infrastructureSetup?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-[#242522]">Fixed Assets (Electrification & Scale)</td>
                      <td className="p-3 text-right font-mono font-semibold">₹{selectedTemplateModal.defaultFinancials.customBreakdown?.fixedAssets?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-[#242522]">Initial Raw Material Inventory (1 Month)</td>
                      <td className="p-3 text-right font-mono font-semibold">₹{selectedTemplateModal.defaultFinancials.customBreakdown?.initialRawMaterialInventory?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-[#242522]">Working Capital Contingency Buffer</td>
                      <td className="p-3 text-right font-mono font-semibold">₹{selectedTemplateModal.defaultFinancials.customBreakdown?.workingCapitalContingency?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-[#242522]">Statutory Licensing (FSSAI, Udyam, Trade)</td>
                      <td className="p-3 text-right font-mono font-semibold">₹{selectedTemplateModal.defaultFinancials.customBreakdown?.statutoryLicensingCosts?.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-[#174C3A]/10 font-bold">
                      <td className="p-3 text-[#174C3A]">Total Project Outlay</td>
                      <td className="p-3 text-right text-[#174C3A] font-mono">₹{selectedTemplateModal.defaultFinancials.projectCost.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Machinery Specifications List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#242522] uppercase tracking-wider">
                Machinery & Equipment List
              </h4>
              <ul className="space-y-1.5 text-xs text-[#68655D]">
                {selectedTemplateModal.equipmentRequired.map((eq, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#F8F5EE] p-2.5 rounded-xl border border-[#D9D3C7]/50">
                    <span className="w-4 h-4 rounded-full bg-[#174C3A] text-[#FCFAF5] flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[#242522] font-medium">{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Mitigation */}
            <div className="bg-[#B95736]/10 p-4 rounded-2xl border border-[#B95736]/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#9F452B]">
                <AlertTriangle className="w-4 h-4" />
                Key Operating Risks & Mitigation
              </div>
              <ul className="list-disc list-inside text-xs text-[#68655D] space-y-1 pl-1">
                {selectedTemplateModal.keyRisks.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTemplateModal(null)}
              >
                Close
              </Button>
              <Button
                variant="terracotta"
                size="sm"
                onClick={() => {
                  handleSelectTemplate(selectedTemplateModal);
                  setSelectedTemplateModal(null);
                }}
              >
                Select This Enterprise Model
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
