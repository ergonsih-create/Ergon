import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  ArrowRight, 
  Clock, 
  FileCheck, 
  Landmark, 
  ShieldCheck, 
  Sparkles,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useDisha } from '../../context/DishaContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApiClient } from '../../services/api/apiClient';

export const ActionPlanView: React.FC = () => {
  const { openAdvisorWithInsight } = useDisha();
  const { activeBusiness } = useAuth();
  const { t } = useLanguage();

  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('');
  const [newAuthority, setNewAuthority] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const businessId = activeBusiness?.id || 'biz_default';

  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getActionMilestones(businessId);
      if (res.status === 'SUCCESS' && Array.isArray(res.data)) {
        setMilestones(res.data);
        setIsLiveConnected(true);
      }
    } catch {
      setIsLiveConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [businessId]);

  const handleToggle = async (id: number) => {
    // Optimistic update
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: m.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
        };
      }
      return m;
    }));

    try {
      await ApiClient.toggleMilestone(id);
    } catch (err) {
      console.error('Failed to toggle milestone on server:', err);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const payload = {
        business_id: businessId,
        title: newTitle.trim(),
        timeframe: newTimeframe.trim() || 'Day 1–15',
        authority: newAuthority.trim() || 'Enterprise Promoter',
        status: 'PENDING'
      };
      await ApiClient.addMilestone(payload);
      setNewTitle('');
      setNewTimeframe('');
      setNewAuthority('');
      setShowAddModal(false);
      await fetchMilestones();
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = milestones.filter(m => m.status === 'COMPLETED').length;
  const totalCount = milestones.length || 1;
  const completionPct = Math.round((completedCount / totalCount) * 100);

  const handleExplainAction = () => {
    openAdvisorWithInsight(
      `Action Execution Status: ${completedCount} of ${totalCount} critical milestones completed (${completionPct}%). Your immediate priority is finalizing statutory clearances and bank loan sanction.`,
      ['Keep Aadhaar and PAN documents synced in DigiLocker for smooth DIC scrutiny.'],
      'Review document guidance checklist to avoid bank appraisal rejections.'
    );
  };

  return (
    <div id="action_plan_view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D9D3C7]/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[#242522]">
            {t('actionPlanRoadmap')}
          </h1>
          <p className="text-xs text-[#68655D] mt-0.5">
            Step 6 of Decision Pipeline: Structured operational milestones and institutional escalation guidance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={completionPct >= 60 ? 'forest' : 'harvest'} size="md">
            {completedCount} / {totalCount} {t('completed')} ({completionPct}%)
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAddModal(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> {t('addMilestone')}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExplainAction} leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#C69A45]" />}>
            {t('explainWithDisha')}
          </Button>
        </div>
      </div>

      <Card title={t('executionMilestones')} subtitle="Track regulatory, banking, and physical setup progress stored in MySQL schema">
        <div className="space-y-3">
          {milestones.map((m, idx) => {
            const isDone = m.status === 'COMPLETED';
            return (
              <div
                key={m.id}
                onClick={() => handleToggle(m.id)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-[#174C3A]/5 border-[#174C3A]/25 text-[#174C3A]'
                    : 'bg-[#FCFAF5] border-[#D9D3C7] text-[#242522] hover:border-[#174C3A]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isDone ? 'bg-[#174C3A] text-[#FCFAF5]' : 'bg-[#D9D3C7]/40 text-[#68655D]'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-[#68655D]' : 'text-[#242522]'}`}>
                      {m.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-[#68655D] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B95736]" /> {m.timeframe}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-[#174C3A]" /> {m.authority}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge variant={isDone ? 'verified' : 'sage'} size="sm">
                  {m.status.replace('_', ' ')}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddMilestone} className="bg-[#FCFAF5] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D9D3C7] space-y-4">
            <h3 className="font-display font-bold text-lg text-[#242522]">{t('addMilestone')}</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#68655D] font-semibold mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., FSSAI Basic License Inspection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D9D3C7] bg-white text-[#242522]"
                />
              </div>

              <div>
                <label className="block text-[#68655D] font-semibold mb-1">Timeframe</label>
                <input
                  type="text"
                  placeholder="e.g., Day 15–20"
                  value={newTimeframe}
                  onChange={(e) => setNewTimeframe(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D9D3C7] bg-white text-[#242522]"
                />
              </div>

              <div>
                <label className="block text-[#68655D] font-semibold mb-1">Supervising Authority</label>
                <input
                  type="text"
                  placeholder="e.g., FDA District Office"
                  value={newAuthority}
                  onChange={(e) => setNewAuthority(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D9D3C7] bg-white text-[#242522]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                {t('forms.cancelBtn')}
              </Button>
              <Button type="submit" variant="forest" size="sm">
                {t('forms.saveProfileBtn') || 'Save'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
