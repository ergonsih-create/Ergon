import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'disha' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  headerAction?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  title,
  subtitle,
  headerAction,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: 'bg-[#FCFAF5] border border-[#D9D3C7] rounded-2xl shadow-sm',
    glass: 'liquid-glass rounded-2xl',
    elevated: 'liquid-glass-elevated rounded-2xl',
    disha: 'liquid-glass-disha rounded-2xl border-emerald-900/20',
    outline: 'bg-transparent border border-[#D9D3C7] rounded-2xl',
  };

  return (
    <div className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`} {...props}>
      {(title || headerAction) && (
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#D9D3C7]/60">
          <div>
            {title && <h3 className="text-lg font-semibold text-[#242522] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-[#68655D] mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
