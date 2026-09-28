import React from 'react';

export interface BadgeProps {
  variant?: 'terracotta' | 'sage' | 'green' | 'navy' | 'gold' | 'charcoal' | 'unknown' | 'verified';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'sage',
  size = 'md',
  children,
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  };

  const variantStyles = {
    terracotta: 'bg-[#B95736]/10 text-[#9F452B] border border-[#B95736]/20 font-medium',
    sage: 'bg-[#71856A]/15 text-[#174C3A] border border-[#71856A]/25 font-medium',
    green: 'bg-[#174C3A]/10 text-[#174C3A] border border-[#174C3A]/20 font-medium',
    navy: 'bg-[#173B57]/10 text-[#173B57] border border-[#173B57]/20 font-medium',
    gold: 'bg-[#C69A45]/15 text-[#B78332] border border-[#C69A45]/25 font-medium',
    charcoal: 'bg-[#242522]/10 text-[#242522] border border-[#242522]/20 font-medium',
    unknown: 'bg-[#68655D]/10 text-[#68655D] border border-dashed border-[#68655D]/40 font-semibold uppercase tracking-wider',
    verified: 'bg-[#174C3A]/15 text-[#174C3A] border border-[#174C3A]/30 font-semibold',
  };

  return (
    <span className={`inline-flex items-center whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon}
      <span>{children}</span>
    </span>
  );
};
