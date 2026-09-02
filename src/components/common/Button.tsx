import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'disha';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#B95736] text-[#FCFAF5] hover:bg-[#9F452B] focus:ring-[#B95736] shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-[#174C3A] text-[#FCFAF5] hover:bg-[#0F3528] focus:ring-[#174C3A] shadow-sm hover:shadow active:scale-[0.98]',
    outline: 'bg-transparent border border-[#D9D3C7] text-[#242522] hover:bg-[#FCFAF5] hover:border-[#B95736] focus:ring-[#B95736]',
    ghost: 'bg-transparent text-[#68655D] hover:text-[#242522] hover:bg-[#D9D3C7]/20 focus:ring-[#68655D]',
    disha: 'bg-gradient-to-r from-[#174C3A] to-[#3F7658] text-[#FCFAF5] hover:from-[#0F3528] hover:to-[#2F5E45] shadow-md hover:shadow-lg focus:ring-[#174C3A]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
