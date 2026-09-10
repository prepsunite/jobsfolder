import React from 'react';
import LogoLoader, { type LogoLoaderProps } from './LogoLoader';

export interface LoadingScreenProps extends LogoLoaderProps {
  /** When true, takes up the full viewport (fixed inset-0). When false, fits section container (min-h-[60vh]) */
  fullScreen?: boolean;
  /** Whether to apply backdrop blur */
  blurBackdrop?: boolean;
}

/**
 * Supabase-style Full-Screen / Section Loading Screen
 * Minimalist, distraction-free screen with an animated orange light rotating around the logo borders.
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  fullScreen = true,
  blurBackdrop = false,
  size = 'md',
  className = '',
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0C0C0C]'
    : 'min-h-[60vh] w-full flex items-center justify-center p-8 bg-transparent';

  const backdropClasses = blurBackdrop
    ? 'backdrop-blur-xl bg-white/90 dark:bg-[#0C0C0C]/90'
    : '';

  return (
    <div
      className={`${containerClasses} ${backdropClasses} transition-opacity duration-300 animate-fadeIn ${className}`}
      data-testid="loading-screen"
    >
      <LogoLoader size={size} />
    </div>
  );
};

export default LoadingScreen;
