import React, { useState, useEffect, useRef } from 'react';

export type BackgroundStyle = 'spotlight' | 'dot-matrix' | 'aurora' | 'blueprint';

interface AtmosphericBackgroundProps {
  initialStyle?: BackgroundStyle;
  showSwitcher?: boolean;
}

export default function AtmosphericBackground({
  initialStyle = 'spotlight',
  showSwitcher = true,
}: AtmosphericBackgroundProps) {
  const [currentStyle, setCurrentStyle] = useState<BackgroundStyle>(() => {
    return (localStorage.getItem('mockfolder_bg_style') as BackgroundStyle) || initialStyle;
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleStyleChange = (style: BackgroundStyle) => {
    setCurrentStyle(style);
    localStorage.setItem('mockfolder_bg_style', style);
  };

  // Interactive Dot-Matrix Canvas Renderer (Only runs if currentStyle === 'dot-matrix')
  useEffect(() => {
    if (currentStyle !== 'dot-matrix') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    const mouse = { x: -1000, y: -1000, isHovering: false };
    const spacing = 32;

    const isDark = () => document.documentElement.classList.contains('dark');

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.parentElement.clientHeight || 1200;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const parent = canvas.parentElement;
    const handleMouseMove = (e: MouseEvent) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const dark = isDark();

      const baseAlpha = dark ? 0.08 : 0.07;
      const spotRadius = 180;

      for (let x = spacing; x < width; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
          let alpha = baseAlpha;
          let dotColor = dark ? '#FFFFFF' : '#121417';

          if (mouse.isHovering) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < spotRadius) {
              const factor = 1 - dist / spotRadius;
              alpha = baseAlpha + factor * 0.45;
              dotColor = '#FD4A32';
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = dotColor === '#FD4A32' ? `rgba(253, 74, 50, ${alpha})` : dark ? `rgba(255, 255, 255, ${alpha})` : `rgba(18, 20, 23, ${alpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [currentStyle]);

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* ── OPTION 1: Spotlight Aura (Clean Vercel/Linear Style) ── */}
        {currentStyle === 'spotlight' && (
          <div className="absolute inset-0">
            {/* Top Center Ambient Radiant Glow */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none opacity-20 dark:opacity-30 blur-[100px]"
              style={{
                background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #FD4A32 0%, #FF8066 35%, transparent 75%)',
              }}
            />
            {/* Soft Ambient Bottom Reflection */}
            <div
              className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none opacity-10 dark:opacity-15 blur-[100px]"
              style={{
                background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
              }}
            />
          </div>
        )}

        {/* ── OPTION 2: Interactive Dot-Matrix (Raycast / Supabase Style) ── */}
        {currentStyle === 'dot-matrix' && (
          <div className="absolute inset-0">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-15 dark:opacity-20 blur-[90px]"
              style={{
                background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #FD4A32 0%, transparent 75%)',
              }}
            />
          </div>
        )}

        {/* ── OPTION 3: Flowing Aurora Mesh (Stripe / Framer Style) ── */}
        {currentStyle === 'aurora' && (
          <div className="absolute inset-0">
            {/* Coral Orb 1 */}
            <div
              className="absolute top-[5%] -left-[10%] w-[650px] h-[650px] rounded-full pointer-events-none opacity-15 dark:opacity-20 blur-[120px] animate-ambient-drift-1"
              style={{
                background: 'radial-gradient(circle, #FD4A32 0%, #FF8066 50%, transparent 80%)',
              }}
            />
            {/* Violet/Amber Orb 2 */}
            <div
              className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full pointer-events-none opacity-12 dark:opacity-18 blur-[120px] animate-ambient-drift-2"
              style={{
                background: 'radial-gradient(circle, #8B5CF6 0%, #F59E0B 50%, transparent 80%)',
              }}
            />
            {/* Top Radiant Spotlight */}
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[750px] h-[350px] pointer-events-none opacity-15 dark:opacity-25 blur-[90px]"
              style={{
                background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #FD4A32 0%, transparent 70%)',
              }}
            />
          </div>
        )}

        {/* ── OPTION 4: Fine Architectural Blueprint (Engineering Style) ── */}
        {currentStyle === 'blueprint' && (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundSize: '40px 40px',
                backgroundImage: `
                  linear-gradient(to right, var(--grid-line-color, rgba(253, 74, 50, 0.08)) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--grid-line-color, rgba(253, 74, 50, 0.08)) 1px, transparent 1px)
                `,
                maskImage: 'radial-gradient(ellipse 85% 75% at 50% 35%, #000 25%, rgba(0, 0, 0, 0.4) 65%, transparent 95%)',
                WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 35%, #000 25%, rgba(0, 0, 0, 0.4) 65%, transparent 95%)',
              }}
            />
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none opacity-18 dark:opacity-25 blur-[80px]"
              style={{
                background: 'radial-gradient(ellipse 60% 40% at 50% 0%, #FD4A32 0%, transparent 75%)',
              }}
            />
          </div>
        )}
      </div>

      {/* 🎛️ Live Floating Background Preview Switcher (Allows instant switching to compare) */}
      {showSwitcher && import.meta.env.DEV && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-white/95 dark:bg-[#161616]/95 backdrop-blur-md border border-[#E9ECEF] dark:border-[#2E2E2E] shadow-xl text-[11px] font-display font-bold select-none transition-all">
          <span className="pl-2 pr-1 text-[#868E96] dark:text-[#777777] uppercase text-[9px] tracking-wider">
            Style:
          </span>
          <button
            type="button"
            onClick={() => handleStyleChange('spotlight')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              currentStyle === 'spotlight'
                ? 'bg-[#FD4A32] text-white shadow-xs'
                : 'text-[#495057] dark:text-[#AAAAAA] hover:text-[#FD4A32]'
            }`}
          >
            1. Spotlight Aura
          </button>
          <button
            type="button"
            onClick={() => handleStyleChange('dot-matrix')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              currentStyle === 'dot-matrix'
                ? 'bg-[#FD4A32] text-white shadow-xs'
                : 'text-[#495057] dark:text-[#AAAAAA] hover:text-[#FD4A32]'
            }`}
          >
            2. Dot Matrix
          </button>
          <button
            type="button"
            onClick={() => handleStyleChange('aurora')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              currentStyle === 'aurora'
                ? 'bg-[#FD4A32] text-white shadow-xs'
                : 'text-[#495057] dark:text-[#AAAAAA] hover:text-[#FD4A32]'
            }`}
          >
            3. Aurora Mesh
          </button>
          <button
            type="button"
            onClick={() => handleStyleChange('blueprint')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              currentStyle === 'blueprint'
                ? 'bg-[#FD4A32] text-white shadow-xs'
                : 'text-[#495057] dark:text-[#AAAAAA] hover:text-[#FD4A32]'
            }`}
          >
            4. Blueprint Grid
          </button>
        </div>
      )}
    </>
  );
}
