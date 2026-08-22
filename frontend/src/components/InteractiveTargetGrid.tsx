import React, { useEffect, useRef } from 'react';

export default function InteractiveTargetGrid() {
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

    // Grid configuration
    const gridSize = 46;
    const mouse = { x: -1000, y: -1000, isHovering: false };

    // Random active pulsing matrix tiles
    interface ActivePulse {
      col: number;
      row: number;
      life: number;
      maxLife: number;
      color: string;
    }
    const activePulses: ActivePulse[] = [];

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

    // Spawn occasional tech pulses across the grid
    const pulseInterval = setInterval(() => {
      if (width === 0 || height === 0) return;
      const cols = Math.floor(width / gridSize);
      const rows = Math.floor(height / gridSize);
      if (activePulses.length < 10) {
        activePulses.push({
          col: Math.floor(Math.random() * cols),
          row: Math.floor(Math.random() * rows),
          life: 0,
          maxLife: Math.floor(Math.random() * 45 + 40),
          color: Math.random() > 0.3 ? '#FD4A32' : '#F59E0B',
        });
      }
    }, 400);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = isDarkTheme();

      // 1. Architectural Blueprint Grid Lines
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.055)' : 'rgba(15, 23, 42, 0.065)';

      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Crosshair Junction Markers (+)
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(15, 23, 42, 0.16)';
      for (let x = gridSize; x < width; x += gridSize * 2) {
        for (let y = gridSize; y < height; y += gridSize * 2) {
          const crossSize = 3;
          ctx.fillRect(x - crossSize, y - 0.5, crossSize * 2, 1);
          ctx.fillRect(x - 0.5, y - crossSize, 1, crossSize * 2);
        }
      }

      // 3. Render and Update Active Flashing Pulses
      for (let i = activePulses.length - 1; i >= 0; i--) {
        const p = activePulses[i];
        p.life += 1;
        const progress = p.life / p.maxLife;
        const alpha = Math.sin(progress * Math.PI) * (isDark ? 0.28 : 0.18);

        const px = p.col * gridSize;
        const py = p.row * gridSize;

        ctx.fillStyle = p.color === '#FD4A32' ? `rgba(253, 74, 50, ${alpha})` : `rgba(245, 158, 11, ${alpha})`;
        ctx.fillRect(px, py, gridSize, gridSize);

        ctx.strokeStyle = p.color === '#FD4A32' ? `rgba(253, 74, 50, ${alpha * 1.6})` : `rgba(245, 158, 11, ${alpha * 1.6})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, gridSize, gridSize);

        if (p.life >= p.maxLife) {
          activePulses.splice(i, 1);
        }
      }

      // 4. 🎯 Interactive Cursor Grid Targeting & Corner Reticles
      if (mouse.isHovering && mouse.x >= 0 && mouse.y >= 0) {
        const hoveredCol = Math.floor(mouse.x / gridSize);
        const hoveredRow = Math.floor(mouse.y / gridSize);
        const hx = hoveredCol * gridSize;
        const hy = hoveredRow * gridSize;

        // Glowing cursor tile fill
        ctx.fillStyle = isDark ? 'rgba(253, 74, 50, 0.16)' : 'rgba(253, 74, 50, 0.10)';
        ctx.fillRect(hx, hy, gridSize, gridSize);

        // Targeted cell border outline
        ctx.strokeStyle = '#FD4A32';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(hx, hy, gridSize, gridSize);

        // Corner Reticles [ ┌ ┐ └ ┘ ]
        const cLen = 6;
        ctx.strokeStyle = '#FD4A32';
        ctx.lineWidth = 2.5;

        // Top-Left
        ctx.beginPath();
        ctx.moveTo(hx - 2, hy + cLen);
        ctx.lineTo(hx - 2, hy - 2);
        ctx.lineTo(hx + cLen, hy - 2);
        ctx.stroke();

        // Top-Right
        ctx.beginPath();
        ctx.moveTo(hx + gridSize + 2 - cLen, hy - 2);
        ctx.lineTo(hx + gridSize + 2, hy - 2);
        ctx.lineTo(hx + gridSize + 2, hy + cLen);
        ctx.stroke();

        // Bottom-Left
        ctx.beginPath();
        ctx.moveTo(hx - 2, hy + gridSize + 2 - cLen);
        ctx.lineTo(hx - 2, hy + gridSize + 2);
        ctx.lineTo(hx + cLen, hy + gridSize + 2);
        ctx.stroke();

        // Bottom-Right
        ctx.beginPath();
        ctx.moveTo(hx + gridSize + 2, hy + gridSize + 2 - cLen);
        ctx.lineTo(hx + gridSize + 2, hy + gridSize + 2);
        ctx.lineTo(hx + gridSize + 2 - cLen, hy + gridSize + 2);
        ctx.stroke();

        // Radial Spotlight Flare around Cursor
        const spotGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        spotGrad.addColorStop(0, isDark ? 'rgba(253, 74, 50, 0.16)' : 'rgba(253, 74, 50, 0.08)');
        spotGrad.addColorStop(0.5, isDark ? 'rgba(245, 158, 11, 0.06)' : 'rgba(251, 146, 60, 0.03)');
        spotGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = spotGrad;
        ctx.fillRect(mouse.x - 220, mouse.y - 220, 440, 440);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(pulseInterval);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
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
