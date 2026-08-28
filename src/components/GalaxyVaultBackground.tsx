import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Compass, Eye, Disc, Zap } from 'lucide-react';

export type GalaxyTheme = 'cosmic_nebula' | 'andromeda_cyan' | 'supernova_gold' | 'deep_violet' | 'hyperdrive';

interface GalaxyVaultBackgroundProps {
  initialTheme?: GalaxyTheme;
  interactive?: boolean;
  intensity?: 'subtle' | 'vibrant' | 'deep';
  showControls?: boolean;
}

interface Star {
  x: number;
  y: number;
  z: number;
  origZ: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
  armAngle?: number;
  armRadius?: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  alpha: number;
  size: number;
  color: string;
}

export const GalaxyVaultBackground: React.FC<GalaxyVaultBackgroundProps> = ({
  initialTheme = 'cosmic_nebula',
  interactive = true,
  intensity = 'vibrant',
  showControls = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTheme, setCurrentTheme] = useState<GalaxyTheme>(initialTheme);
  const [warpMode, setWarpMode] = useState<boolean>(false);
  const [showSettingsPill, setShowSettingsPill] = useState<boolean>(false);

  // Mouse tilt tracking
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Color palettes per galaxy theme
  const getThemePalettes = (theme: GalaxyTheme) => {
    switch (theme) {
      case 'andromeda_cyan':
        return {
          bg1: '#020610',
          bg2: '#040d1f',
          nebulaColors: [
            'rgba(0, 240, 255, 0.14)',
            'rgba(14, 165, 233, 0.12)',
            'rgba(56, 189, 248, 0.08)',
            'rgba(2, 132, 199, 0.1)',
          ],
          starColors: ['#E0F2FE', '#7DD3FC', '#38BDF8', '#00F0FF', '#FFFFFF', '#BAE6FD'],
          coreGlow: 'rgba(0, 240, 255, 0.35)',
        };
      case 'supernova_gold':
        return {
          bg1: '#0a0602',
          bg2: '#1a0e05',
          nebulaColors: [
            'rgba(245, 158, 11, 0.15)',
            'rgba(234, 88, 12, 0.12)',
            'rgba(251, 191, 36, 0.09)',
            'rgba(217, 119, 6, 0.1)',
          ],
          starColors: ['#FEF3C7', '#FDE68A', '#FBBF24', '#F59E0B', '#FFFFFF', '#FED7AA'],
          coreGlow: 'rgba(245, 158, 11, 0.35)',
        };
      case 'deep_violet':
        return {
          bg1: '#06020c',
          bg2: '#0f051c',
          nebulaColors: [
            'rgba(168, 85, 247, 0.15)',
            'rgba(139, 92, 246, 0.12)',
            'rgba(192, 132, 252, 0.08)',
            'rgba(126, 34, 206, 0.1)',
          ],
          starColors: ['#F3E8FF', '#E9D5FF', '#C084FC', '#A855F7', '#FFFFFF', '#DDD6FE'],
          coreGlow: 'rgba(168, 85, 247, 0.35)',
        };
      case 'hyperdrive':
        return {
          bg1: '#010206',
          bg2: '#030712',
          nebulaColors: [
            'rgba(0, 240, 255, 0.18)',
            'rgba(255, 0, 127, 0.15)',
            'rgba(99, 102, 241, 0.12)',
            'rgba(16, 185, 129, 0.1)',
          ],
          starColors: ['#00F0FF', '#FF007F', '#FFFFFF', '#38BDF8', '#F43F5E', '#A855F7'],
          coreGlow: 'rgba(0, 240, 255, 0.45)',
        };
      case 'cosmic_nebula':
      default:
        return {
          bg1: '#03040a',
          bg2: '#080816',
          nebulaColors: [
            'rgba(99, 102, 241, 0.14)',
            'rgba(236, 72, 153, 0.11)',
            'rgba(0, 240, 255, 0.13)',
            'rgba(168, 85, 247, 0.1)',
          ],
          starColors: ['#FFFFFF', '#E0E7FF', '#C7D2FE', '#00F0FF', '#F472B6', '#A78BFA'],
          coreGlow: 'rgba(99, 102, 241, 0.35)',
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.targetX = nx * 35;
      mouseRef.current.targetY = ny * 35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Generate 3D Galactic Stars (Spiral Arms & Background Starfield)
    const numStars = width < 768 ? 400 : 750;
    const stars: Star[] = [];
    const palette = getThemePalettes(currentTheme);

    const numArms = 3;
    const armSpread = 0.5;

    for (let i = 0; i < numStars; i++) {
      const isSpiralArm = i < numStars * 0.65;
      let x = 0, y = 0, z = 0;
      let armAngle = 0;
      let armRadius = 0;

      if (isSpiralArm) {
        // Spiral arm distribution
        const armIndex = i % numArms;
        armRadius = Math.pow(Math.random(), 1.5) * 1200 + 40;
        armAngle = (armIndex * (2 * Math.PI / numArms)) + (armRadius * 0.0035) + (Math.random() - 0.5) * armSpread;
        
        x = Math.cos(armAngle) * armRadius + (Math.random() - 0.5) * 120;
        y = Math.sin(armAngle) * (armRadius * 0.45) + (Math.random() - 0.5) * 100; // Elliptical projection
        z = (Math.random() - 0.5) * 1400;
      } else {
        // Deep background random spherical field
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * 1500;
        x = Math.cos(angle) * rad;
        y = Math.sin(angle) * rad;
        z = (Math.random() - 0.5) * 2000;
      }

      stars.push({
        x,
        y,
        z,
        origZ: z,
        size: Math.random() * 1.8 + 0.5,
        color: palette.starColors[Math.floor(Math.random() * palette.starColors.length)],
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        armAngle,
        armRadius,
      });
    }

    // Meteors / Shooting stars array
    const meteors: Meteor[] = [];
    let lastMeteorTime = performance.now();

    let rotationAngle = 0;
    const fov = 420;

    // Render loop
    const render = (time: number) => {
      const currentPalette = getThemePalettes(currentTheme);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Clear & draw deep space background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2 + mouseRef.current.x * 2,
        height / 2 + mouseRef.current.y * 2,
        20,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, currentPalette.bg2);
      bgGrad.addColorStop(1, currentPalette.bg1);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Volumetric Galaxy Core & Cosmic Dust Clouds
      const cx = width / 2 + mouseRef.current.x;
      const cy = height / 2 + mouseRef.current.y;

      const timeSec = time * 0.001;
      const rotationSpeed = warpMode ? 0.015 : 0.0012;
      rotationAngle += rotationSpeed;

      // Draw Atmospheric Nebula Clouds
      ctx.save();
      for (let n = 0; n < currentPalette.nebulaColors.length; n++) {
        const offsetAngle = (n * Math.PI) / 2 + rotationAngle * 0.4;
        const dist = 120 + Math.sin(timeSec * 0.5 + n) * 40;
        const nx = cx + Math.cos(offsetAngle) * dist;
        const ny = cy + Math.sin(offsetAngle) * (dist * 0.6);
        const radius = 260 + Math.sin(timeSec * 0.7 + n) * 60;

        const nebGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, radius);
        nebGrad.addColorStop(0, currentPalette.nebulaColors[n]);
        nebGrad.addColorStop(0.5, currentPalette.nebulaColors[n].replace(')', ', 0.5)').replace('rgba', 'rgba'));
        nebGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = nebGrad;
        ctx.beginPath();
        ctx.arc(nx, ny, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glowing Center Core / Gravitational Accretion Glow
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
      coreGrad.addColorStop(0, currentPalette.coreGlow);
      coreGrad.addColorStop(0.3, currentPalette.coreGlow.replace('0.35', '0.12').replace('0.45', '0.18'));
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render 3D Rotating Galactic Starfield
      const cosR = Math.cos(rotationAngle);
      const sinR = Math.sin(rotationAngle);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // 3D rotation in galactic plane (X-Z plane or X-Y)
        const rx = s.x * cosR - s.y * sinR;
        const ry = s.x * sinR + s.y * cosR;
        
        let zPos = s.z + 800;
        if (warpMode) {
          s.z -= 18;
          if (s.z < -700) s.z = 900;
          zPos = s.z + 800;
        }

        if (zPos <= 10) continue;

        // 3D Perspective Projection
        const scale = fov / zPos;
        const screenX = cx + rx * scale;
        const screenY = cy + ry * scale * 0.75; // Slight tilt perspective

        if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
          continue;
        }

        // Twinkle factor
        s.twinklePhase += s.twinkleSpeed;
        const twinkle = Math.sin(s.twinklePhase) * 0.35 + 0.65;
        const starSize = Math.max(0.6, s.size * scale * (warpMode ? 1.5 : 1));
        const alpha = Math.min(1, Math.max(0.1, (1 - zPos / 1800) * twinkle));

        ctx.save();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;

        if (warpMode) {
          // Warp streak lines towards center
          const prevScale = fov / (zPos + 40);
          const prevX = cx + rx * prevScale;
          const prevY = cy + ry * prevScale * 0.75;

          ctx.strokeStyle = s.color;
          ctx.lineWidth = starSize;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(screenX, screenY);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(screenX, screenY, starSize, 0, Math.PI * 2);
          ctx.fill();

          // Extra luminous flare on brightest foreground stars
          if (s.size > 1.8 && alpha > 0.6) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(screenX, screenY, starSize * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // Periodically spawn meteors
      if (time - lastMeteorTime > 3000 + Math.random() * 4000 && !warpMode) {
        lastMeteorTime = time;
        const startX = Math.random() * width;
        const startY = Math.random() * (height * 0.4);
        const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 8 + 10;
        meteors.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          len: Math.random() * 80 + 60,
          alpha: 1,
          size: Math.random() * 2 + 1,
          color: currentPalette.starColors[Math.floor(Math.random() * currentPalette.starColors.length)],
        });
      }

      // Update and draw meteors
      for (let m = meteors.length - 1; m >= 0; m--) {
        const meteor = meteors[m];
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.alpha -= 0.015;

        if (meteor.alpha <= 0) {
          meteors.splice(m, 1);
          continue;
        }

        ctx.save();
        const grad = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          meteor.x - meteor.vx * (meteor.len / 10),
          meteor.y - meteor.vy * (meteor.len / 10)
        );
        grad.addColorStop(0, meteor.color);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = meteor.size;
        ctx.globalAlpha = meteor.alpha;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(
          meteor.x - meteor.vx * (meteor.len / 10),
          meteor.y - meteor.vy * (meteor.len / 10)
        );
        ctx.stroke();

        // Meteor glowing head
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size * 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentTheme, warpMode, interactive]);

  const themes: { id: GalaxyTheme; name: string; icon: string; border: string; glow: string }[] = [
    { id: 'cosmic_nebula', name: 'Cosmic Nebula', icon: '🌌', border: 'border-pink-500/40', glow: '#EC4899' },
    { id: 'andromeda_cyan', name: 'Andromeda Cyan', icon: '🌀', border: 'border-cyan-400/40', glow: '#00F0FF' },
    { id: 'supernova_gold', name: 'Supernova Gold', icon: '✨', border: 'border-amber-400/40', glow: '#F59E0B' },
    { id: 'deep_violet', name: 'Deep Space Violet', icon: '🔮', border: 'border-purple-400/40', glow: '#A855F7' },
    { id: 'hyperdrive', name: 'Hyperdrive Warp', icon: '⚡', border: 'border-blue-400/40', glow: '#38BDF8' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Galaxy Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{
          opacity: intensity === 'subtle' ? 0.65 : intensity === 'deep' ? 0.95 : 0.85,
        }}
      />

      {/* Subtle Galactic Grid Horizon Line at Bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0, 240, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(600px) rotateX(72deg) translateY(60px)',
          transformOrigin: 'bottom center',
        }}
      />
    </div>
  );
};
