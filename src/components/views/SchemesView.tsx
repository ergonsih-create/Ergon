/**
 * @license
 * GRAM-DISHA — Versioned Government Scheme Matcher
 * Evaluates candidate rules strictly from official source registers.
 */

import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  FileText,
  Filter,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SchemeEngine } from '../../services/deterministic/schemeEngine';
import { SchemeMatch } from '../../types';
import { useDisha } from '../../context/DishaContext';
import { useAuth } from '../../context/AuthContext';

export const SchemesView: React.FC<{ onNavigate?: (mod: any) => void }> = ({ onNavigate }) => {
  const { openAdvisorWithInsight } = useDisha();
  const { user, activeBusiness } = useAuth();

  const [filterState, setFilterState] = useState<'ALL' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE'>('ALL');
  const [selectedSchemeForDocs, setSelectedSchemeForDocs] = useState<SchemeMatch | null>(null);

  const evaluatedSchemes = SchemeEngine.evaluateSchemes({
    category: user?.demographics.category || 'OBC',
    gender: user?.demographics.gender || 'FEMALE',
    isRural: user?.location.isRural ?? true,
    projectCost: 850000,
    activityType: 'AGRO_PROCESSING',
    annualIncome: user?.demographics.annualHouseholdIncome || 180000,
  });

  const filtered = evaluatedSchemes.filter((s) => {
    if (filterState === 'ALL') return true;
    return s.eligibilityState === filterState;
  });

  const handleExplainScheme = (scheme: SchemeMatch) => {
    openAdvisorWithInsight(
      `Under ${scheme.schemeName} (${scheme.schemeCode}), you are evaluated as ${scheme.eligibilityState.replace('_', ' ')}. You qualify for up to ₹${(scheme.maxSubsidyOrAssistance / 100000).toFixed(2)} Lakh assistance based on your rural location and demographic category.`,
      scheme.qualifyingCriteriaPassed,
      scheme.eligibilityState === 'POTENTIALLY_ELIGIBLE'
        ? `Submit your application through the official ${scheme.responsibleAuthority} channel.`
        : 'Review the unmet statutory requirements to explore alternative credit schemes.'
    );
  };

  return (
    <div id="schemes_view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            Versioned Government Scheme Matcher
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Deterministic eligibility matching against official KVIC, MoFPI, SIDBI, and NABARD rulesets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="forest" size="md">5 Registered Schemes</Badge>
          <Button 
            variant="terracotta" 
            size="sm" 
            onClick={() => {
              openAdvisorWithInsight(
                'I have matched 5 central and state schemes for your Dal Mill unit. PMEGP offers the highest capital subsidy (35% / ₹2.97L) for rural OBC/Women entrepreneurs.',
                ['PMEGP: 35% Capital Subsidy', 'PMFME: 35% ODOP Credit Grant', 'MUDRA Tarun: Collateral-Free Term Loan'],
                'Prioritize PMEGP for maximum non-repayable margin money grant.'
              );
            }}
            className="text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#C69A45]" />
            DISHA Scheme Guidance
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterState('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filterState === 'ALL'
              ? 'bg-[#174C3A] text-[#FCFAF5]'
              : 'bg-[#FCFAF5] text-[#68655D] hover:bg-[#F8F5EE] border border-[#D9D3C7]'
          }`}
        >
          All Schemes ({evaluatedSchemes.length})
        </button>
        <button
          onClick={() => setFilterState('POTENTIALLY_ELIGIBLE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filterState === 'POTENTIALLY_ELIGIBLE'
              ? 'bg-[#174C3A] text-[#FCFAF5]'
              : 'bg-[#FCFAF5] text-[#68655D] hover:bg-[#F8F5EE] border border-[#D9D3C7]'
          }`}
        >
          Potentially Eligible ({evaluatedSchemes.filter(s => s.eligibilityState === 'POTENTIALLY_ELIGIBLE').length})
        </button>
        <button
          onClick={() => setFilterState('NOT_ELIGIBLE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            filterState === 'NOT_ELIGIBLE'
              ? 'bg-[#174C3A] text-[#FCFAF5]'
              : 'bg-[#FCFAF5] text-[#68655D] hover:bg-[#F8F5EE] border border-[#D9D3C7]'
          }`}
        >
          Not Eligible ({evaluatedSchemes.filter(s => s.eligibilityState === 'NOT_ELIGIBLE').length})
        </button>
      </div>

      {/* Schemes Card List */}
      <div className="space-y-4">
        {filtered.map((scheme) => {
          const isEligible = scheme.eligibilityState === 'POTENTIALLY_ELIGIBLE';
          const maxSubsidyLakh = (scheme.maxSubsidyOrAssistance / 100000).toFixed(2);
          const eligibleLoanLakh = (scheme.eligibleLoanAmount / 100000).toFixed(2);

          return (
            <Card key={scheme.schemeId} className="hover:border-[#174C3A]/50 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                
                {/* Left: Scheme Details & Badges */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={isEligible ? 'forest' : 'terracotta'} size="md">
                      {isEligible ? 'Potentially Eligible' : 'Criteria Ineligible'}
                    </Badge>
                    <Badge variant="harvest" size="sm">Rule {scheme.ruleVersion}</Badge>
                    <span className="text-[11px] text-[#68655D] font-mono">
                      Authority: {scheme.ministryOrAgency}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-display text-[#242522]">
                      {scheme.schemeName} ({scheme.schemeCode})
                    </h3>
                    <p className="text-xs text-[#68655D] mt-1 leading-relaxed">
                      {scheme.benefitSummary || `Official credit-linked financial assistance administered by ${scheme.responsibleAuthority}.`}
                    </p>
                  </div>

                  {/* Criteria Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="bg-[#F8F5EE] p-3 rounded-2xl border border-[#D9D3C7]/60">
                      <span className="font-bold text-[#174C3A] block mb-1.5">Qualifying Criteria Met:</span>
                      <ul className="space-y-1 text-[#242522]">
                        {scheme.qualifyingCriteriaPassed.map((q, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#174C3A] shrink-0 mt-0.5" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {scheme.unmetCriteria.length > 0 ? (
                      <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200">
                        <span className="font-bold text-[#9F452B] block mb-1.5">Unmet Statutory Conditions:</span>
                        <ul className="space-y-1 text-rose-950">
                          {scheme.unmetCriteria.map((u, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                              <span>{u}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                        <span className="font-bold text-emerald-800 block mb-1.5">Subsidy Structure:</span>
                        <div className="text-xs text-emerald-950 space-y-1">
                          <div>Capital Subsidy Rate: <strong>{scheme.subsidyPercentage || 0}%</strong></div>
                          <div>Max Capital Assistance: <strong>₹{maxSubsidyLakh} Lakh</strong></div>
                          <div>Eligible Bank Credit: <strong>₹{eligibleLoanLakh} Lakh</strong></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions & Portal Links */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
                  <Button
                    variant="terracotta"
                    size="sm"
                    className="text-xs justify-center"
                    onClick={() => handleExplainScheme(scheme)}
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-[#C69A45]" />
                    Explain with DISHA
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs justify-center"
                    onClick={() => setSelectedSchemeForDocs(scheme)}
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    Required Documents ({scheme.requiredDocuments.length})
                  </Button>

                  {scheme.officialPortalUrl && (
                    <a
                      href={scheme.officialPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D9D3C7] bg-[#FCFAF5] hover:bg-[#F8F5EE] text-xs font-semibold text-[#242522] transition-colors"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3 text-[#68655D]" />
                    </a>
                  )}
                </div>

              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal: Required Documents Checklist */}
      {selectedSchemeForDocs && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FCFAF5] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#D9D3C7] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="forest">{selectedSchemeForDocs.schemeCode}</Badge>
                <h3 className="font-display font-bold text-lg text-[#242522] mt-1">
                  Mandatory Application Checklist
                </h3>
                <p className="text-xs text-[#68655D]">
                  {selectedSchemeForDocs.schemeName}
                </p>
              </div>
              <button
                onClick={() => setSelectedSchemeForDocs(null)}
                className="w-7 h-7 rounded-full bg-[#F8F5EE] border border-[#D9D3C7] flex items-center justify-center text-xs font-bold text-[#68655D]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {selectedSchemeForDocs.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8F5EE] border border-[#D9D3C7] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#174C3A] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[#242522] font-semibold block">{doc.name}</span>
                    <span className="text-[10px] text-[#68655D]">Authority: {doc.issuingAuthority} • {doc.mandatory ? 'Mandatory' : 'Optional'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSchemeForDocs(null)}
              >
                Close
              </Button>
              <Button
                variant="forest"
                size="sm"
                onClick={() => {
                  setSelectedSchemeForDocs(null);
                  onNavigate && onNavigate('DOCUMENTS');
                }}
              >
                Open Document Readiness Vault
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
