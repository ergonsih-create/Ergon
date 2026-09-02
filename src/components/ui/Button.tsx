import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'terracotta' | 'outline' | 'glass' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  icon,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8A96B]/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 rounded-xl gap-1.5 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 rounded-2xl gap-2 min-h-[44px]',
    lg: 'text-base px-7 py-3.5 rounded-2xl gap-2.5 min-h-[48px]',
  };

  const variantClasses = {
    primary:
      'bg-[#3B2F2A] text-[#FAF7F2] hover:bg-[#2D2420] border border-[#3B2F2A] shadow-sm hover:shadow-md',
    secondary:
      'bg-[#F2E8D6] text-[#3B2F2A] hover:bg-[#E8DCC6] border border-[#C8A96B]/30',
    gold:
      'bg-[#C8A96B] text-[#3B2F2A] hover:bg-[#B89858] font-semibold border border-[#C8A96B] shadow-sm',
    terracotta:
      'bg-[#B45B4A] text-[#FAF7F2] hover:bg-[#9E4C3C] border border-[#B45B4A] shadow-sm hover:shadow-md',
    outline:
      'bg-transparent text-[#3B2F2A] hover:bg-[#F2E8D6]/60 border border-[#C8A96B]/40',
    glass:
      'bg-[#FAF7F2]/80 backdrop-blur-md text-[#3B2F2A] hover:bg-[#FAF7F2] border border-[#C8A96B]/30 shadow-xs',
    dark:
      'bg-[#2D2420] text-[#FAF7F2] hover:bg-[#1F1815] border border-[#C8A96B]/30 shadow-sm',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
