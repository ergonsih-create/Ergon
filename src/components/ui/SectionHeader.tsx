import React from 'react';

export interface SectionHeaderProps {
  eyebrow?: string;
  headline: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  headline,
  description,
  align = 'center',
  className = '',
}) => {
  const alignClasses =
    align === 'center'
      ? 'text-center items-center mx-auto max-w-3xl'
      : 'text-left items-start max-w-3xl';

  return (
    <div className={`flex flex-col space-y-3 ${alignClasses} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-wider uppercase text-[#B45B4A] font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B45B4A]" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-[#3B2F2A] leading-tight tracking-[-0.02em]">
        {headline}
      </h2>
      {description && (
        <p className="text-[15px] sm:text-base text-[#3B2F2A]/90 leading-relaxed font-sans font-normal sm:font-medium">
          {description}
        </p>
      )}
    </div>
  );
};
