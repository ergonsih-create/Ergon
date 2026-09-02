import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Badge } from './Badge';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [effectiveType, setEffectiveType] = useState<string>('4g');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Network Information API check if available
    const nav = navigator as any;
    if (nav.connection) {
      setEffectiveType(nav.connection.effectiveType || '4g');
      const handleConnectionChange = () => {
        setEffectiveType(nav.connection.effectiveType || '4g');
      };
      nav.connection.addEventListener('change', handleConnectionChange);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        nav.connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9F452B]/10 text-[#9F452B] border border-[#9F452B]/20 text-xs font-medium">
        <WifiOff className="w-3.5 h-3.5 animate-pulse" />
        <span>Offline Mode (Cached)</span>
      </div>
    );
  }

  const isLowBandwidth = effectiveType === '2g' || effectiveType === '3g' || effectiveType === 'slow-2g';

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#174C3A]/10 text-[#174C3A] text-xs">
      <Wifi className="w-3 h-3 text-[#174C3A]" />
      <span className="font-medium uppercase text-[10px] tracking-wider">{effectiveType}</span>
      {isLowBandwidth && (
        <span className="text-[10px] text-[#B95736] font-semibold flex items-center gap-0.5">
          <RefreshCw className="w-2.5 h-2.5" /> Lite
        </span>
      )}
    </div>
  );
};
