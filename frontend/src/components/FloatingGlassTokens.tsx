import React, { useEffect, useRef } from 'react';

interface DropKey {
  x: number;
  y: number;
  speed: number;
  char: string;
  size: number;
  color: string;
  alpha: number;
  rot: number;
  rotSpeed: number;
  depth: number;
}

const CHAR_POOL = ['<', '>', '✦', '*', '{', '}', '//', '_', '+', '~', '&', ';', '=>', '.', '01', 'λ', '[]'];

export default function FloatingGlassTokens() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, currOffsetX: 0, targetOffsetX: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const isDarkTheme = () => document.documentElement.classList.contains('dark');

    // Create dropping particles pool
    const particles: DropKey[] = [];
    const particleCount = 28;

    const createParticle = (spawnY?: number): DropKey => {
      const isCoral = Math.random() > 0.45;
      const isAmber = !isCoral && Math.random() > 0.5;
      const color = isCoral ? '#FD4A32' : isAmber ? '#F59E0B' : 'neutral';

      return {
        x: Math.random() * (width || window.innerWidth),
        y: spawnY !== undefined ? spawnY : Math.random() * (height || 350),
        speed: Math.random() * 0.7 + 0.35, // Gentle falling speed
        char: CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)],
        size: Math.floor(Math.random() * 8 + 24), // 24px - 32px keycaps
        color,
        alpha: Math.random() * 0.35 + 0.2,
        rot: (Math.random() - 0.5) * 0.25,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        depth: Math.random() * 1.5 + 0.8,
      };
    };

    const handleResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 350;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Re-populate particles if needed
      if (particles.length === 0) {
        for (let i = 0; i < particleCount; i++) {
          particles.push(createParticle());
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.targetOffsetX = ((e.clientX - rect.left) / width - 0.5) * 35;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.targetOffsetX = 0;
    };

    const parent = container.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // 60fps Continuous Falling Loop
    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = isDarkTheme();

      // Smooth mouse parallax interpolation
      mouseRef.current.currOffsetX +=
        (mouseRef.current.targetOffsetX - mouseRef.current.currOffsetX) * 0.05;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Move downwards
        p.y += p.speed;
        p.rot += p.rotSpeed;

        // 2. Respawn smoothly at the top when exiting bottom
        if (p.y > height + 40) {
          const fresh = createParticle(-40 - Math.random() * 30);
          p.x = fresh.x;
          p.y = fresh.y;
          p.speed = fresh.speed;
          p.char = fresh.char;
          p.size = fresh.size;
          p.color = fresh.color;
          p.alpha = fresh.alpha;
          p.rot = fresh.rot;
          p.depth = fresh.depth;
        }

        // 3. Calculate screen position with parallax
        const px = p.x + mouseRef.current.currOffsetX * p.depth;
        const py = p.y;

        // 4. Draw Frosted Glass Keycap Tile
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rot);

        const halfSize = p.size / 2;
        const cornerRadius = 6;

        // Glass background fill
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${p.alpha * 0.12})`
          : `rgba(15, 23, 42, ${p.alpha * 0.06})`;

        // Glass border
        ctx.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${p.alpha * 0.28})`
          : `rgba(15, 23, 42, ${p.alpha * 0.2})`;
        ctx.lineWidth = 1;

        // Rounded rect
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(-halfSize, -halfSize, p.size, p.size, cornerRadius);
        } else {
          ctx.rect(-halfSize, -halfSize, p.size, p.size);
        }
        ctx.fill();
        ctx.stroke();

        // 5. Draw Character/Symbol Inside Keycap
        let textColor = isDark ? `rgba(255, 255, 255, ${p.alpha * 1.8})` : `rgba(30, 41, 59, ${p.alpha * 1.8})`;
        if (p.color === '#FD4A32') {
          textColor = `rgba(253, 74, 50, ${p.alpha * 2.2})`;
        } else if (p.color === '#F59E0B') {
          textColor = `rgba(245, 158, 11, ${p.alpha * 2.2})`;
        }

        ctx.fillStyle = textColor;
        ctx.font = `700 ${Math.floor(p.size * 0.44)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, 0, 1);

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* ── Soft Ambient Backing Aura ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[220px] rounded-full opacity-10 dark:opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, #FD4A32 0%, transparent 80%)',
          filter: 'blur(65px)',
        }}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
