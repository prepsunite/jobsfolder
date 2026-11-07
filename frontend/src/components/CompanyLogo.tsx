import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

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
    icon: 'w-3 h-3',
  },
  sm: {
    box: 'w-8 h-8 rounded-lg',
    img: 'w-5 h-5',
    text: 'text-xs',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    box: 'w-12 h-12 rounded-xl',
    img: 'w-8 h-8',
    text: 'text-sm',
    icon: 'w-5 h-5',
  },
  lg: {
    box: 'w-16 h-16 rounded-2xl',
    img: 'w-10 h-10',
    text: 'text-lg',
    icon: 'w-7 h-7',
  },
  xl: {
    box: 'w-20 h-20 rounded-2xl',
    img: 'w-12 h-12',
    text: 'text-xl',
    icon: 'w-8 h-8',
  },
};

const GRADIENT_PALETTES = [
  'from-blue-600 to-indigo-700 text-white',
  'from-emerald-600 to-teal-700 text-white',
  'from-violet-600 to-purple-800 text-white',
  'from-rose-500 to-red-700 text-white',
  'from-amber-500 to-orange-600 text-white',
  'from-cyan-600 to-blue-700 text-white',
  'from-fuchsia-600 to-pink-700 text-white',
  'from-indigo-600 to-sky-700 text-white',
  'from-teal-600 to-emerald-700 text-white',
  'from-zinc-700 to-zinc-900 text-white',
];

function getMonogram(name: string): string {
  if (!name) return 'CO';
  // Strip legal terms and parentheses
  const cleaned = name.replace(/\(.*?\)/g, '').replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (name[0] || 'C').toUpperCase();
}

function getGradient(name: string): string {
  if (!name) return GRADIENT_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index];
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
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const monogram = getMonogram(companyName);
  const gradient = getGradient(companyName);

  return (
    <div
      title={companyName}
      className={`relative ${cfg.box} bg-gradient-to-br ${gradient} flex items-center justify-center font-bold font-mono tracking-tight shrink-0 shadow-2xs select-none overflow-hidden ${className}`}
    >
      {/* Background subtle company watermark icon */}
      <Building2 className="absolute -bottom-1 -right-1 w-2/3 h-2/3 text-white/10 pointer-events-none" />
      <span className={`relative z-10 font-black drop-shadow-xs ${cfg.text}`}>
        {monogram}
      </span>
    </div>
  );
}
