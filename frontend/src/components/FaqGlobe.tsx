import React, { useEffect, useRef } from 'react';

interface CompanyNode {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

export default function FaqGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const isDarkTheme = () => document.documentElement.classList.contains('dark');

    // ── Globe Settings ──────────────────────────────────────
    let globeRadius = 160;
    let globeCenter = { x: 0, y: 0 };
    let rotY = 0.5;
    let rotX = 0.28;
    let targetRotX = 0.28;
    const autoSpeed = 0.0022; // Smooth, relaxed planetary rotation

    // Balanced Spherical Distribution (Evenly Spaced Across All Quadrants with Zero Collision)
    const companies: CompanyNode[] = [
      // Quadrant 1: Asia & Subcontinent (lng: 40° to 135°)
      { name: 'TCS', lat: 24, lng: 70, country: 'India' },
      { name: 'Infosys', lat: -5, lng: 95, country: 'India' },
      { name: 'Wipro', lat: -28, lng: 60, country: 'India' },
      { name: 'Cognizant', lat: 38, lng: 45, country: 'India' },
      { name: 'Tech Mahindra', lat: 10, lng: 115, country: 'India' },
      { name: 'Samsung', lat: 38, lng: 135, country: 'Asia' },
      { name: 'HCL Tech', lat: 50, lng: 85, country: 'India' },

      // Quadrant 2: Europe & Middle East & Africa (lng: -30° to 35°)
      { name: 'Accenture', lat: 48, lng: 5, country: 'Europe' },
      { name: 'Capgemini', lat: 25, lng: 25, country: 'Europe' },
      { name: 'Deloitte', lat: 55, lng: -15, country: 'UK' },
      { name: 'LTIMindtree', lat: -15, lng: 20, country: 'EMEA' },

      // Quadrant 3: Americas East & Atlantic (lng: -90° to -40°)
      { name: 'IBM', lat: 42, lng: -72, country: 'US' },
      { name: 'Goldman Sachs', lat: 22, lng: -55, country: 'US' },
      { name: 'JP Morgan', lat: -20, lng: -45, country: 'US' },
      { name: 'Oracle', lat: 8, lng: -85, country: 'US' },

      // Quadrant 4: Americas West & Pacific (lng: -175° to -105°)
      { name: 'Amazon', lat: 48, lng: -120, country: 'US' },
      { name: 'Google', lat: 28, lng: -142, country: 'US' },
      { name: 'Microsoft', lat: 55, lng: -100, country: 'US' },
      { name: 'Meta', lat: 10, lng: -165, country: 'US' },
      { name: 'Apple', lat: -25, lng: -110, country: 'US' },
      { name: 'Adobe', lat: 32, lng: -175, country: 'US' },
      { name: 'Qualcomm', lat: -10, lng: -130, country: 'US' },
      { name: 'Cisco', lat: -40, lng: -80, country: 'US' },
    ];

    // Connective Placement Arcs (Spanning all continents smoothly)
    const arcs: [number, number][] = [
      [0, 15],  // TCS -> Amazon
      [1, 16],  // Infosys -> Google
      [3, 7],   // Cognizant -> Accenture
      [0, 1],   // TCS -> Infosys
      [1, 4],   // Infosys -> Tech Mahindra
      [4, 5],   // Tech Mahindra -> Samsung
      [0, 6],   // TCS -> HCL Tech
      [7, 8],   // Accenture -> Capgemini
      [8, 9],   // Capgemini -> Deloitte
      [9, 11],  // Deloitte -> IBM
      [11, 15], // IBM -> Amazon
      [15, 17], // Amazon -> Microsoft
      [16, 18], // Google -> Meta
      [18, 19], // Meta -> Apple
      [12, 13], // Goldman Sachs -> JP Morgan
      [14, 12], // Oracle -> Goldman Sachs
      [20, 5],  // Adobe -> Samsung
      [21, 16], // Qualcomm -> Google
      [2, 10],  // Wipro -> LTIMindtree
      [10, 0],  // LTIMindtree -> TCS
      [13, 22], // JP Morgan -> Cisco
    ];

    // Dense Dot Matrix on Sphere Surface (for clean continent/globe texture)
    interface Dot3D {
      x: number;
      y: number;
      z: number;
    }
    const sphereDots: Dot3D[] = [];
    const numLat = 22;
    for (let i = 0; i <= numLat; i++) {
      const lat = ((i / numLat) * 180 - 90) * (Math.PI / 180);
      const radiusAtLat = Math.cos(lat);
      const numLng = Math.max(6, Math.floor(44 * radiusAtLat));

      for (let j = 0; j < numLng; j++) {
        const lng = ((j / numLng) * 360 - 180) * (Math.PI / 180);
        sphereDots.push({
          x: Math.cos(lat) * Math.sin(lng),
          y: -Math.sin(lat),
          z: Math.cos(lat) * Math.cos(lng),
        });
      }
    }

    // Latitude & Longitude Meridian Rings
    const latRings: { latRad: number }[] = [];
    for (let l = -60; l <= 60; l += 30) {
      latRings.push({ latRad: (l * Math.PI) / 180 });
    }
    const lngRings: { lngRad: number }[] = [];
    for (let g = 0; g < 360; g += 45) {
      lngRings.push({ lngRad: (g * Math.PI) / 180 });
    }

    const handleResize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      width = rect.width || 440;
      height = rect.height || 440;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      globeCenter = { x: width * 0.5, y: height * 0.5 };
      globeRadius = Math.min(width * 0.40, height * 0.40, 175);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Interactive cursor dragging & tilting
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        rotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const my = (e.clientY - rect.top) / height - 0.5;
        targetRotX = my * 0.45;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // ── 3D Projection Math ──────────────────────────────────
    const project = (x3d: number, y3d: number, z3d: number) => {
      // 1. Rotate Y (Azimuth)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x3d * cosY + z3d * sinY;
      const z1 = -x3d * sinY + z3d * cosY;

      // 2. Rotate X (Elevation / Tilt)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y3d * cosX - z1 * sinX;
      const z2 = y3d * sinX + z1 * cosX;

      // 3. Perspective project
      const fov = 650;
      const scale = fov / (fov + z2);

      return {
        x: globeCenter.x + x1 * scale,
        y: globeCenter.y + y2 * scale,
        z: z2,
        scale,
        isFront: z2 > -15, // Smooth front-facing check
      };
    };

    const latLngToXYZ = (lat: number, lng: number, r = globeRadius) => {
      const phi = (lat * Math.PI) / 180;
      const theta = (lng * Math.PI) / 180;
      return {
        x: r * Math.cos(phi) * Math.sin(theta),
        y: -r * Math.sin(phi),
        z: r * Math.cos(phi) * Math.cos(theta),
      };
    };

    let pulseProgress = 0;

    // ── Render Loop ─────────────────────────────────────────
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = isDarkTheme();

      // Smooth auto-rotation & damping
      if (!isDragging) {
        rotY += autoSpeed;
        rotX += (targetRotX - rotX) * 0.05;
      }
      pulseProgress += 0.007; // Steady, elegant laser pulse speed

      // 1. Outer Atmospheric Rim Glow (No dark core in the middle!)
      const rimGrad = ctx.createRadialGradient(
        globeCenter.x,
        globeCenter.y,
        globeRadius * 0.85,
        globeCenter.x,
        globeCenter.y,
        globeRadius * 1.35
      );
      rimGrad.addColorStop(0, 'transparent');
      rimGrad.addColorStop(0.7, isDark ? 'rgba(253, 74, 50, 0.12)' : 'rgba(253, 74, 50, 0.06)');
      rimGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(globeCenter.x, globeCenter.y, globeRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Outer Planetary Orbit Ring
      ctx.beginPath();
      for (let a = 0; a <= 360; a += 6) {
        const rad = (a * Math.PI) / 180;
        const ox = Math.cos(rad) * (globeRadius * 1.22);
        const oy = Math.sin(rad * 2) * 10;
        const oz = Math.sin(rad) * (globeRadius * 1.22);
        const p = project(ox, oy, oz);
        if (a === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = isDark ? 'rgba(253, 74, 50, 0.35)' : 'rgba(253, 74, 50, 0.22)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw 3D Meridian Wireframe Grid Rings
      ctx.lineWidth = 0.85;

      // Latitude circles
      latRings.forEach(({ latRad }) => {
        ctx.beginPath();
        const rLat = globeRadius * Math.cos(latRad);
        const yLat = -globeRadius * Math.sin(latRad);
        for (let a = 0; a <= 360; a += 10) {
          const lngRad = (a * Math.PI) / 180;
          const px = rLat * Math.sin(lngRad);
          const py = yLat;
          const pz = rLat * Math.cos(lngRad);
          const p = project(px, py, pz);
          if (a === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.09)';
        ctx.stroke();
      });

      // Longitude circles
      lngRings.forEach(({ lngRad }) => {
        ctx.beginPath();
        for (let a = -90; a <= 90; a += 10) {
          const latRad = (a * Math.PI) / 180;
          const px = globeRadius * Math.cos(latRad) * Math.sin(lngRad);
          const py = -globeRadius * Math.sin(latRad);
          const pz = globeRadius * Math.cos(latRad) * Math.cos(lngRad);
          const p = project(px, py, pz);
          if (a === -90) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.09)';
        ctx.stroke();
      });

      // 4. Draw 3D Surface Dot Matrix
      sphereDots.forEach((d) => {
        const px = d.x * globeRadius;
        const py = d.y * globeRadius;
        const pz = d.z * globeRadius;
        const p = project(px, py, pz);

        // Normalize depth for alpha: points closer to camera are brighter
        const depthRatio = (p.z + globeRadius) / (globeRadius * 2);
        const alpha = Math.max(0.08, Math.min(0.85, depthRatio * 0.9));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.isFront ? 1.4 : 0.9, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${p.isFront ? alpha : alpha * 0.3})`
          : `rgba(30, 41, 59, ${p.isFront ? alpha * 0.85 : alpha * 0.25})`;
        ctx.fill();
      });

      // 5. Draw 3D Luminous Connecting Arcs & Smooth Laser Pulses
      arcs.forEach(([idxA, idxB], arcIndex) => {
        const cA = companies[idxA];
        const cB = companies[idxB];
        const vA = latLngToXYZ(cA.lat, cA.lng);
        const vB = latLngToXYZ(cB.lat, cB.lng);

        const steps = 30;
        ctx.beginPath();
        let firstDrawn = false;

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          // Great-circle elevated curve
          const arcLift = Math.sin(t * Math.PI) * 36;
          const mx = vA.x * (1 - t) + vB.x * t;
          const my = vA.y * (1 - t) + vB.y * t;
          const mz = vA.z * (1 - t) + vB.z * t;
          const len = Math.sqrt(mx * mx + my * my + mz * mz) || 1;

          const rElev = globeRadius + arcLift;
          const point = project((mx / len) * rElev, (my / len) * rElev, (mz / len) * rElev);

          if (!firstDrawn) {
            ctx.moveTo(point.x, point.y);
            firstDrawn = true;
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }

        ctx.strokeStyle = isDark ? 'rgba(253, 74, 50, 0.45)' : 'rgba(253, 74, 50, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Smooth Steady Laser Energy Pulse
        const pulseT = (pulseProgress + arcIndex * 0.28) % 1;
        const arcLift = Math.sin(pulseT * Math.PI) * 36;
        const mx = vA.x * (1 - pulseT) + vB.x * pulseT;
        const my = vA.y * (1 - pulseT) + vB.y * pulseT;
        const mz = vA.z * (1 - pulseT) + vB.z * pulseT;
        const len = Math.sqrt(mx * mx + my * my + mz * mz) || 1;
        const rElev = globeRadius + arcLift;
        const pulseP = project((mx / len) * rElev, (my / len) * rElev, (mz / len) * rElev);

        if (pulseP.isFront) {
          ctx.beginPath();
          ctx.arc(pulseP.x, pulseP.y, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FD4A32';
          ctx.shadowBlur = isDark ? 12 : 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 6. Draw Placement Hub Pins & Crystal-Clear Floating Badges
      companies.forEach((co) => {
        const v = latLngToXYZ(co.lat, co.lng);
        const p = project(v.x, v.y, v.z);

        if (p.isFront) {
          // Soft outer ripple beacon
          const beaconSize = 4 + Math.sin(pulseProgress * 10) * 2.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, beaconSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(253, 74, 50, 0.3)';
          ctx.fill();

          // Solid pinpoint
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FD4A32';
          ctx.fill();

          // Elegant Floating Badge
          ctx.font = '700 10.5px var(--font-display), sans-serif';
          const label = co.name;
          const textW = ctx.measureText(label).width;
          const bx = p.x + 8;
          const by = p.y - 10;
          const bw = textW + 12;
          const bh = 19;

          // Badge Background
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 4);
          ctx.fillStyle = isDark ? 'rgba(15, 17, 21, 0.92)' : 'rgba(255, 255, 255, 0.95)';
          ctx.fill();
          ctx.strokeStyle = isDark ? 'rgba(253, 74, 50, 0.6)' : 'rgba(253, 74, 50, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Badge Text
          ctx.fillStyle = isDark ? '#FFFFFF' : '#0F172A';
          ctx.fillText(label, bx + 6, by + 13.5);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[460px] flex items-center justify-center pointer-events-auto select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
