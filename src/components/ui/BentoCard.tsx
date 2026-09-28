import React from 'react';

export interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'disha' | 'dark';
  onClick?: () => void;
  id?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  id,
}) => {
  const variantStyles = {
    default: 'bg-[#FAF7F2] border border-[#C8A96B]/25 hover:border-[#B45B4A]/40 shadow-xs hover:shadow-md',
    glass: 'glass-panel hover:border-[#C8A96B]/40',
    elevated: 'glass-panel-elevated hover:border-[#B45B4A]/50 shadow-md',
    disha: 'glass-panel-disha hover:border-[#5A6B4F]/40 shadow-md',
    dark: 'glass-panel-dark hover:border-[#C8A96B]/50 shadow-lg',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 ${variantStyles[variant]} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
