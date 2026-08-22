import React, { useEffect, useRef } from 'react';

export default function CtaSpotlight() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const beamConeRef = useRef<HTMLDivElement | null>(null);

  // Physics state for smooth 60fps spring interpolation
  const posRef = useRef({
    currX: 0,
    currY: 0,
    targetX: 0,
    targetY: 0,
    initialized: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      if (!posRef.current.initialized) {
        posRef.current.currX = rect.width * 0.5;
        posRef.current.currY = rect.height * 0.55;
        posRef.current.targetX = rect.width * 0.5;
        posRef.current.targetY = rect.height * 0.55;
        posRef.current.initialized = true;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      posRef.current.targetX = e.clientX - rect.left;
      posRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      const rect = container.getBoundingClientRect();
      posRef.current.targetX = rect.width * 0.5;
      posRef.current.targetY = rect.height * 0.55;
    };

    const parent = container.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // 60fps Animation Loop
    const loop = () => {
      const p = posRef.current;
      const rect = container.getBoundingClientRect();
      const width = rect.width || window.innerWidth;

      // Smooth lerp towards mouse
      p.currX += (p.targetX - p.currX) * 0.085;
      p.currY += (p.targetY - p.currY) * 0.085;

      // ── FIXED LIGHT SOURCE AT EXACT TOP CENTER (50%, 0) ──
      const originX = width * 0.5;
      const originY = 0;

      // Calculate angle from fixed center origin to cursor
      const dx = p.currX - originX;
      const dy = Math.max(p.currY - originY, 40); // prevent division by zero / negative height

      // Correct screen rotation angle so beam points directly to cursor
      const angleRad = Math.atan2(dx, dy);
      const angleDeg = -(angleRad * 180) / Math.PI;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 1. Pivot Angled Light Beam Cone from exact top-center (50%, 0)
      if (beamConeRef.current) {
        beamConeRef.current.style.transform = `translateX(-50%) rotate(${angleDeg}deg)`;
        beamConeRef.current.style.height = `${Math.max(dist + 250, 520)}px`;
      }

      // 2. Move Focused Radiant Spotlight Flare to Cursor Position
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${p.currX}px, ${p.currY}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateDimensions);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* ── 1. FIXED LIGHT SOURCE AT EXACT TOP CENTER ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        {/* Core Glowing Laser Bar */}
        <div className="w-[200px] sm:w-[320px] h-[3.5px] bg-[#FD4A32] rounded-full shadow-[0_0_30px_6px_#FD4A32]" />
        {/* Intense Optical Fixture Glow */}
        <div className="w-[120px] sm:w-[180px] h-[10px] bg-[#FD4A32]/60 rounded-full blur-[4px] -mt-[3px]" />
      </div>

      {/* ── 2. ANGLED SPOTLIGHT BEAM CONE (Apex Locked at Top-Center 50%, 0) ── */}
      <div
        ref={beamConeRef}
        className="absolute top-0 left-1/2 w-[500px] sm:w-[720px] will-change-transform z-10 opacity-80 dark:opacity-90 pointer-events-none"
        style={{
          transformOrigin: '50% 0px',
          transform: 'translateX(-50%) rotate(0deg)',
          background: 'linear-gradient(to bottom, rgba(253, 74, 50, 0.55) 0%, rgba(253, 74, 50, 0.20) 35%, rgba(245, 158, 11, 0.08) 68%, transparent 100%)',
          clipPath: 'polygon(48.5% 0%, 51.5% 0%, 100% 100%, 0% 100%)',
          WebkitClipPath: 'polygon(48.5% 0%, 51.5% 0%, 100% 100%, 0% 100%)',
          filter: 'blur(22px)',
        }}
      />

      {/* ── 3. FOCUSED RADIANT SPOTLIGHT AT CURSOR ── */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 will-change-transform z-10 pointer-events-none"
        style={{
          transform: 'translate3d(50%, 50%, 0) translate(-50%, -50%)',
        }}
      >
        {/* Primary Soft Spotlight */}
        <div
          className="w-[480px] h-[480px] rounded-full opacity-70 dark:opacity-80"
          style={{
            background: 'radial-gradient(circle, #FD4A32 0%, rgba(253, 74, 50, 0.35) 28%, rgba(245, 158, 11, 0.12) 52%, transparent 75%)',
            filter: 'blur(45px)',
          }}
        />
        {/* Center Bright Spark */}
        <div
          className="absolute inset-0 m-auto w-[170px] h-[170px] rounded-full opacity-50 dark:opacity-65"
          style={{
            background: 'radial-gradient(circle, #FFFFFF 0%, #FD4A32 45%, transparent 75%)',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* ── 4. AMBIENT BASE WARMTH BEHIND CTA ── */}
      <div
        className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[300px] rounded-full opacity-25 dark:opacity-35 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(253, 74, 50, 0.35) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 80%)',
          filter: 'blur(75px)',
        }}
      />

      {/* ── 5. SPOTLIGHT-MASKED ARCHITECTURAL GRID ── */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-25 pointer-events-none"
        style={{
          backgroundSize: '36px 36px',
          backgroundImage: `
            linear-gradient(to right, rgba(253, 74, 50, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(253, 74, 50, 0.12) 1px, transparent 1px)
          `,
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 30%, #000 35%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 30%, #000 35%, transparent 90%)',
        }}
      />
    </div>
  );
}
