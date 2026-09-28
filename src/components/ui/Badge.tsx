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
    xs: 'text-[11px] font-semibold px-2 py-0.5 rounded-md gap-1 leading-normal',
    sm: 'text-[11.5px] sm:text-[12px] font-semibold px-2.5 py-1 rounded-lg gap-1.5 leading-normal',
    md: 'text-[12px] sm:text-[12.5px] font-semibold px-3 py-1.5 rounded-xl gap-2 leading-normal',
  };

  const variantClasses = {
    olive: 'bg-[#5A6B4F]/15 text-[#2E3C27] font-semibold border border-[#5A6B4F]/35',
    gold: 'bg-[#C8A96B]/20 text-[#5C4518] font-semibold border border-[#C8A96B]/50',
    terracotta: 'bg-[#B45B4A]/15 text-[#8C3829] font-semibold border border-[#B45B4A]/35',
    brown: 'bg-[#3B2F2A] text-[#FAF7F2] font-semibold border border-[#3B2F2A]',
    ivory: 'bg-[#FAF7F2] text-[#2D2420] font-semibold border border-[#C8A96B]/35',
    neutral: 'bg-[#F2E8D6] text-[#2D2420] font-semibold border border-[#D9D3C7]',
    unknown: 'bg-[#FAF7F2] text-[#5C4518] font-semibold border border-dashed border-[#C8A96B] font-mono',
  };

  return (
    <span
      className={`inline-flex items-center font-sans tracking-normal select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
