import React from 'react';

interface GramDishaIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  className?: string;
}

/**
 * Custom Gram-Disha Brand Icon
 * Combines Directional Compass / Sun Rays + Rural Enterprise Sprout Motif
 */
export const GramDishaIcon: React.FC<GramDishaIconProps> = ({
  size = 20,
  color = '#C8A96B',
  className = '',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Outer directional star / compass diamond rays */}
      <path
        d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
        fill={color}
        fillOpacity="0.25"
        stroke={color}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Central North pointer needle */}
      <path
        d="M12 3.5L13.2 8.8L12 10L10.8 8.8L12 3.5Z"
        fill={color}
      />
      {/* Central Rural Sprout Leaf motif */}
      <path
        d="M12 10.5C12 10.5 15.5 12 15.5 15C15.5 17 14 18.5 12 18.5C10 18.5 8.5 17 8.5 15C8.5 12 12 10.5 12 10.5Z"
        fill="#5A6B4F"
      />
      <path
        d="M12 12V21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 15C13.5 13.8 16 13.5 16 13.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Base Foundation Arc */}
      <path
        d="M6 19.5C8 21 10 21.5 12 21.5C14 21.5 16 21 18 19.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

interface GramDishaLogoBoxProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const GramDishaLogoBox: React.FC<GramDishaLogoBoxProps> = ({
  size = 'md',
  className = '',
  onClick,
  title,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg text-xs',
    md: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 26,
  };

  return (
    <div
      onClick={onClick}
      title={title}
      className={`bg-[#3B2F2A] border border-[#C8A96B]/40 flex items-center justify-center text-[#FAF7F2] shadow-xs ${
        onClick ? 'cursor-pointer hover:border-[#C8A96B] transition-colors' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      <GramDishaIcon size={iconSizes[size]} color="#C8A96B" />
    </div>
  );
};

export default GramDishaIcon;
