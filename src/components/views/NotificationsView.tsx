/**
 * @license
 * GRAM-DISHA — Notifications & Activity Stream View (/notifications)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Strict No-Demo-Data Policy:
 * Displays only genuine system alerts and activity triggered by authenticated user actions.
 */

import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Landmark, 
  Boxes, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDisha } from '../../context/DishaContext';
import { AppNotification } from '../../types';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useAuth();
  const { setModule } = useDisha();
  const [filter, setFilter] = useState<'ALL' | 'SCHEMES' | 'OPERATIONS' | 'DISHA'>('ALL');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'SCHEMES') return n.type === 'SCHEME_UPDATE' || n.type === 'DOCUMENT_ALERT';
    if (filter === 'OPERATIONS') return n.type === 'INVENTORY_LOW' || n.type === 'FINANCIAL_REMINDER';
    if (filter === 'DISHA') return n.type === 'DISHA_INSIGHT';
    return true;
  });

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'SCHEME_UPDATE':
      case 'DOCUMENT_ALERT':
        return <Landmark className="w-4 h-4 text-[#174C3A]" />;
      case 'INVENTORY_LOW':
      case 'FINANCIAL_REMINDER':
        return <Boxes className="w-4 h-4 text-[#C69A45]" />;
      case 'DISHA_INSIGHT':
        return <Sparkles className="w-4 h-4 text-[#B45B4A]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#3B2F2A]" />;
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.actionUrl) {
      if (notif.actionUrl.includes('operations')) setModule('INVENTORY');
      else if (notif.actionUrl.includes('scheme') || notif.actionUrl.includes('application')) setModule('APPLICATIONS');
      else if (notif.actionUrl.includes('support')) setModule('SUPPORT');
      else if (notif.actionUrl.includes('business')) setModule('BUSINESS_IDEAS');
      else setModule('DASHBOARD');
    }
  };

  return (
    <div id="notifications_view_root" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C8A96B]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#174C3A] text-[#FAF7F2] flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5 text-[#C8A96B]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#3B2F2A]">
              Notifications & Activity Stream
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#3B2F2A]/70 mt-1">
            Real-time audit log of your enterprise actions, DPR filings, inventory updates, and scheme alerts.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#B45B4A]/30 text-xs font-semibold text-[#B45B4A] hover:bg-[#B45B4A]/10 transition-colors cursor-pointer w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#C8A96B]/20 pb-2 overflow-x-auto scrollbar-none">
        {(['ALL', 'SCHEMES', 'OPERATIONS', 'DISHA'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === tab
                ? 'bg-[#174C3A] text-[#FAF7F2] shadow-2xs'
                : 'text-[#3B2F2A]/70 hover:bg-[#F2E8D6]/50'
            }`}
          >
            {tab === 'ALL' && `All Alerts (${notifications.length})`}
            {tab === 'SCHEMES' && 'Schemes & Applications'}
            {tab === 'OPERATIONS' && 'Operations & Stock'}
            {tab === 'DISHA' && 'Disha Insights'}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F2E8D6] flex items-center justify-center text-[#3B2F2A]/60 mb-4">
            <CheckCircle2 className="w-7 h-7 text-[#5A6B4F]" />
          </div>
          <h3 className="text-base font-bold text-[#3B2F2A]">No Unread Notifications</h3>
          <p className="text-xs text-[#3B2F2A]/70 mt-2 leading-relaxed">
            Your activity stream is completely up to date. As you register businesses, record sales, prepare scheme applications, or lodge support tickets, real updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notif.read 
                  ? 'bg-[#FAF7F2]/60 border-[#C8A96B]/20 opacity-80' 
                  : 'bg-[#FAF7F2] border-[#C8A96B]/50 shadow-xs ring-1 ring-[#C8A96B]/20'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#F2E8D6] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#3B2F2A]">{notif.title}</span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#B45B4A]" />
                    )}
                  </div>
                  <p className="text-xs text-[#3B2F2A]/80 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-[#3B2F2A]/50 mt-1.5 block font-mono">
                    {new Date(notif.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!notif.read && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="px-2.5 py-1 rounded-lg border border-[#C8A96B]/40 hover:bg-[#F2E8D6]/60 text-[11px] font-semibold text-[#3B2F2A] transition-colors cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
                {notif.actionUrl && (
                  <button
                    onClick={() => handleActionClick(notif)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#174C3A] text-[#FAF7F2] text-[11px] font-bold hover:bg-[#174C3A]/90 transition-colors cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
