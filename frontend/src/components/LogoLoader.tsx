import React, { useId } from 'react';

export interface LogoLoaderProps {
  /** Size of the logo loader */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional custom class names */
  className?: string;
}

const SIZES = {
  sm: {
    box: 'w-10 h-10',
    glow: 'w-20 h-20',
  },
  md: {
    box: 'w-16 h-16',
    glow: 'w-32 h-32',
  },
  lg: {
    box: 'w-24 h-24',
    glow: 'w-44 h-44',
  },
  xl: {
    box: 'w-36 h-36',
    glow: 'w-64 h-64',
  },
};

// Exact vector path for the 8-pointed asterisk / starburst PrepUnite logo centered at (100, 100)
const LOGO_PATH_D =
  'M 89.00 28.00 L 111.00 28.00 L 111.00 73.44 L 143.13 41.31 L 158.69 56.87 L 126.56 89.00 L 172.00 89.00 L 172.00 111.00 L 126.56 111.00 L 158.69 143.13 L 143.13 158.69 L 111.00 126.56 L 111.00 172.00 L 89.00 172.00 L 89.00 126.56 L 56.87 158.69 L 41.31 143.13 L 73.44 111.00 L 28.00 111.00 L 28.00 89.00 L 73.44 89.00 L 41.31 56.87 L 56.87 41.31 L 89.00 73.44 Z';

/**
 * Supabase-style Animated Logo Loader
 * The orange light rotates seamlessly and continuously in the 8-pointed asterisk shape of the PrepUnite logo.
 * No text, zero clutter, pure minimalist geometry.
 */
export const LogoLoader: React.FC<LogoLoaderProps> = ({
  size = 'md',
  className = '',
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const clipId = `prepunite-logo-clip-${uniqueId}`;
  const glowId = `prepunite-logo-glow-${uniqueId}`;
  const s = SIZES[size];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      {/* ── Soft Ambient Radial Orange Halo ── */}
      <div
        className={`absolute ${s.glow} rounded-full bg-[#FD4A32]/25 dark:bg-[#FD4A32]/30 blur-2xl pointer-events-none animate-orange-glow`}
      />

      {/* ── The Logo Vector with Light Rotating in the Shape of the Logo ── */}
      <div className={`relative ${s.box} flex items-center justify-center`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* The exact 8-pointed star logo shape as a clip path */}
            <clipPath id={clipId}>
              <path d={LOGO_PATH_D} />
            </clipPath>

            {/* Neon Glow Filter */}
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Muted Base Shape Fill & Outline */}
          <path
            d={LOGO_PATH_D}
            className="fill-neutral-200/50 dark:fill-white/[0.04] stroke-neutral-300/80 dark:stroke-white/10"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* 2. Rotating Light Beam strictly inside the shape of the logo (Full 360° sweeping radiance across all 8 arms) */}
          <g clipPath={`url(#${clipId})`}>
            <foreignObject x="0" y="0" width="200" height="200">
              <div
                className="w-full h-full animate-photon-beam pointer-events-none origin-center"
                style={{
                  background:
                    'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(253, 74, 50, 0.1) 60deg, rgba(253, 74, 50, 0.45) 180deg, rgba(253, 74, 50, 0.85) 280deg, #FD4A32 330deg, #FFA07A 352deg, #FFFFFF 360deg)',
                }}
              />
            </foreignObject>
          </g>

          {/* 3. Glowing Light Stroke racing along the exact perimeter contours of the logo (Seamless Loop via pathLength=100) */}
          <path
            d={LOGO_PATH_D}
            pathLength="100"
            fill="none"
            stroke="#FD4A32"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-logo-contour"
            filter={`url(#${glowId})`}
          />

          {/* 4. Crisp White Photon Core traveling along the contour */}
          <path
            d={LOGO_PATH_D}
            pathLength="100"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-logo-contour"
          />
        </svg>
      </div>
    </div>
  );
};

export default LogoLoader;
