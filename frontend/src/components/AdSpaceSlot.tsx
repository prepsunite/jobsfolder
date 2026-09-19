import React from 'react';

interface AdSpaceSlotProps {
  slot?: string;
  variant?: 'skyscraper' | 'rectangle' | 'stacked';
  className?: string;
}

export default function AdSpaceSlot({
  slot = 'default-right-rail',
  className = '',
}: AdSpaceSlotProps) {
  // Blank space reserved for future ad network integration (e.g., Google AdSense / Sponsor scripts)
  return (
    <aside
      className={`w-full min-h-[300px] pointer-events-none select-none ${className}`}
      aria-label="Advertisement Space"
      data-slot-id={slot}
    />
  );
}
