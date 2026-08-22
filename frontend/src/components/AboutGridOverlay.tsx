import React from 'react';

export default function AboutGridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ── Geometric Architectural Blueprint Grid with Elliptical Radial Mask ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, var(--grid-line-color, rgba(253, 74, 50, 0.11)) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line-color, rgba(253, 74, 50, 0.11)) 1px, transparent 1px)
          `,
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 38%, #000 25%, rgba(0, 0, 0, 0.45) 60%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 38%, #000 25%, rgba(0, 0, 0, 0.45) 60%, transparent 95%)',
        }}
      />

      {/* ── Secondary Fine Architectural Crosshair Points ── */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-30"
        style={{
          backgroundSize: '80px 80px',
          backgroundImage: `
            radial-gradient(circle, #FD4A32 1.2px, transparent 1.2px)
          `,
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 40%, #000 20%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 40%, #000 20%, transparent 90%)',
        }}
      />

      {/* ── Subtle Top Center Ambient Warmth ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-15 dark:opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #FD4A32 0%, transparent 75%)',
          filter: 'blur(70px)',
        }}
      />
    </div>
  );
}
