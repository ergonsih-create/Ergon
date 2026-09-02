import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'olive' | 'gold' | 'terracotta' | 'brown' | 'ivory' | 'neutral' | 'unknown';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon,
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
    sm: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    md: 'text-xs px-3 py-1.5 rounded-xl gap-2 font-medium',
  };

  const variantClasses = {
    olive: 'bg-[#5A6B4F]/12 text-[#3D4C34] border border-[#5A6B4F]/30',
    gold: 'bg-[#C8A96B]/15 text-[#6B5324] border border-[#C8A96B]/40',
    terracotta: 'bg-[#B45B4A]/12 text-[#9E4C3C] border border-[#B45B4A]/30',
    brown: 'bg-[#3B2F2A] text-[#FAF7F2] border border-[#3B2F2A]',
    ivory: 'bg-[#FAF7F2] text-[#3B2F2A] border border-[#C8A96B]/30',
    neutral: 'bg-[#F2E8D6] text-[#3B2F2A] border border-[#D9D3C7]',
    unknown: 'bg-[#FAF7F2] text-[#6B5324] border border-dashed border-[#C8A96B] font-mono',
  };

  return (
    <span
      className={`inline-flex items-center font-medium tracking-tight select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
