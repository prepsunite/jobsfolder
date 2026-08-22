import React, { useEffect, useRef } from 'react';

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
  headColor: string;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function MeteorsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const isDarkTheme = () => document.documentElement.classList.contains('dark');

    // Meteor shower angle (diagonal: ~35 degrees down-left)
    const angle = (215 * Math.PI) / 180;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    let meteors: Meteor[] = [];
    let stars: Star[] = [];
    const maxMeteors = 16;
    const maxStars = 45;

    const createMeteor = (randomStart = false): Meteor => {
      const isDark = isDarkTheme();
      const isAccent = Math.random() > 0.35;

      // Spawn meteors along top and right edge
      const spawnFromTop = Math.random() > 0.4;
      const startX = randomStart
        ? Math.random() * width * 1.3
        : spawnFromTop
        ? Math.random() * (width + 300)
        : width + Math.random() * 150;
      const startY = randomStart
        ? Math.random() * height
        : spawnFromTop
        ? -100 - Math.random() * 200
        : Math.random() * (height * 0.6);

      return {
        x: startX,
        y: startY,
        length: Math.random() * 160 + 100, // 100px - 260px tail
        speed: Math.random() * 4.5 + 4.5, // High-speed sleek streak
        size: Math.random() * 1.8 + 1.2,
        opacity: Math.random() * 0.4 + 0.6,
        color: isAccent
          ? isDark ? 'rgba(253, 74, 50, ' : 'rgba(253, 74, 50, '
          : isDark ? 'rgba(245, 158, 11, ' : 'rgba(239, 68, 68, ',
        headColor: isAccent ? '#FFFFFF' : isDark ? '#FFF' : '#FD4A32',
      };
    };

    const initScene = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.parentElement.clientHeight || 650;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Create initial meteors
      meteors = [];
      for (let i = 0; i < maxMeteors; i++) {
        meteors.push(createMeteor(true));
      }

      // Create ambient twinkling stars
      stars = [];
      for (let i = 0; i < maxStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.8,
          alpha: Math.random() * 0.6 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.015,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    initScene();
    window.addEventListener('resize', initScene);

    // Interactive mouse clicks / moves spawn custom fast meteor bursts
    const parent = canvas.parentElement;
    const handleMouseMove = (e: MouseEvent) => {
      if (!parent || Math.random() > 0.25) return;
      const rect = parent.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Spawn burst meteor near cursor
      if (meteors.length < maxMeteors + 5) {
        meteors.push({
          x: mx + (Math.random() - 0.5) * 80,
          y: my + (Math.random() - 0.5) * 80,
          length: Math.random() * 180 + 120,
          speed: Math.random() * 6 + 7,
          size: 2.2,
          opacity: 0.95,
          color: 'rgba(253, 74, 50, ',
          headColor: '#FFFFFF',
        });
      }
    };

    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
    }

    let time = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;
      const isDark = isDarkTheme();

      // 1. Ambient Radiant Background Glows
      const glow1 = ctx.createRadialGradient(width * 0.75, height * 0.25, 20, width * 0.75, height * 0.25, width * 0.5);
      glow1.addColorStop(0, isDark ? 'rgba(253, 74, 50, 0.20)' : 'rgba(253, 74, 50, 0.10)');
      glow1.addColorStop(0.6, isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(251, 146, 60, 0.04)');
      glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Twinkling Ambient Stars
      stars.forEach((star) => {
        const currentAlpha = star.alpha + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(0.85, currentAlpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${clampedAlpha})`
          : `rgba(74, 85, 104, ${clampedAlpha * 0.7})`;
        ctx.fill();
      });

      // 3. Render and Update Diagonal Meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];

        // Move meteor along angle
        m.x += cosAngle * m.speed;
        m.y -= sinAngle * m.speed; // moving downwards

        // Tail origin point
        const tailX = m.x - cosAngle * m.length;
        const tailY = m.y + sinAngle * m.length;

        // Draw Meteor Streak Gradient Tail
        const streakGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        streakGrad.addColorStop(0, `${m.color}0)`);
        streakGrad.addColorStop(0.65, `${m.color}${m.opacity * (isDark ? 0.35 : 0.25)})`);
        streakGrad.addColorStop(1, `${m.color}${m.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = streakGrad;
        ctx.lineWidth = m.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw Glowing Meteor Head Flare
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = m.headColor;
        ctx.shadowColor = '#FD4A32';
        ctx.shadowBlur = isDark ? 12 : 6;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // If meteor flies out of canvas boundaries, respawn or remove
        if (m.x < -200 || m.y > height + 200) {
          if (meteors.length > maxMeteors) {
            meteors.splice(i, 1);
          } else {
            meteors[i] = createMeteor(false);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', initScene);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  );
}
