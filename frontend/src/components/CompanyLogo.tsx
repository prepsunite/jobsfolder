import React, { useState } from 'react';

interface CompanyLogoProps {
  logoUrl?: string | null;
  companyName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CONFIG = {
  xs: {
    box: 'w-6 h-6 rounded-md',
    img: 'w-4 h-4',
    text: 'text-[10px]',
  },
  sm: {
    box: 'w-8 h-8 rounded-lg',
    img: 'w-5 h-5',
    text: 'text-xs',
  },
  md: {
    box: 'w-12 h-12 rounded-xl',
    img: 'w-8 h-8',
    text: 'text-base',
  },
  lg: {
    box: 'w-16 h-16 rounded-2xl',
    img: 'w-10 h-10',
    text: 'text-xl',
  },
  xl: {
    box: 'w-20 h-20 rounded-2xl',
    img: 'w-12 h-12',
    text: 'text-2xl',
  },
};

function getCompanyInitial(name: string): string {
  if (!name) return 'C';
  // Strip parentheses and non-alphanumeric noise e.g. "EyeROV (IROV Tech Pvt Ltd)" -> "EyeROV"
  const cleaned = name.replace(/\(.*?\)/g, '').replace(/[^a-zA-Z0-9\s]/g, '').trim();
  return (cleaned[0] || name[0] || 'C').toUpperCase();
}

export default function CompanyLogo({
  logoUrl,
  companyName,
  size = 'md',
  className = '',
}: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);
  const cfg = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const showImage = Boolean(logoUrl && !imgError);

  if (showImage) {
    return (
      <div
        className={`relative ${cfg.box} bg-white dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs ${className}`}
      >
        <img
          src={logoUrl!}
          alt={companyName}
          loading="lazy"
          className={`${cfg.img} object-contain`}
          onLoad={(e) => {
            const img = e.currentTarget;
            // Google Favicons fallback returns a 16x16 pixelated globe
            if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
              setImgError(true);
            }
          }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const initial = getCompanyInitial(companyName);

  return (
    <div
      title={companyName}
      className={`relative ${cfg.box} bg-white dark:bg-[#1A1A1A] border border-[#E9ECEF] dark:border-[#2A2A2A] text-[#121417] dark:text-[#FFFFFF] flex items-center justify-center font-display font-black tracking-tight shrink-0 shadow-2xs select-none overflow-hidden ${className}`}
    >
      <span className={`relative z-10 leading-none ${cfg.text}`}>
        {initial}
      </span>
    </div>
  );
}
