"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  color: string
  radius: number
  x: number
  y: number
  ring: number
  move: number
  random: number
  type: 'orbit' | 'emitter';
  alpha: number;
  targetR: number; // For emitters
}

interface SpaceBackgroundProps {
  particleCount?: number
  particleColor?: string
  backgroundColor?: string
  className?: string
  emitterPositions?: { x: number; y: number }[];
}

// --- Utility: parse RGB/hex colors ---
function parseRGB(cssColor: string) {
  if (!cssColor) return null
  cssColor = cssColor.trim()

  // hex
  if (cssColor[0] === "#") {
    let hex = cssColor.slice(1)
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("")
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return [r, g, b]
  }

  // rgb/rgba
  const m = cssColor.match(/rgba?\(([^)]+)\)/)
  if (m) {
    const parts = m[1].split(",").map((s) => parseFloat(s.trim()))
    return [parts[0], parts[1], parts[2]]
  }

  return null
}

export function SpaceBackground({
  particleCount = 450,
  particleColor = "blue",
  backgroundColor = "transparent",
  className = "",
  emitterPositions = [],
}: SpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const [resolvedColor, setResolvedColor] = useState<string | undefined>(undefined)
  const rgbColor = useRef<[number, number, number]>([0, 0, 0]);


  useEffect(() => {
      setResolvedColor(particleColor);
      const parsed = parseRGB(particleColor);
      if (parsed) {
        rgbColor.current = parsed as [number, number, number];
      }
  }, [particleColor])

  // --- Draw / animate ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!resolvedColor) return;

    const state = {
      particles: [] as Particle[],
      r: 120,
      counter: 0,
    };

    let transformRatio = 1;

    const setupCanvas = () => {
        const rect = canvas.parentElement!.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const smallerDim = Math.min(canvas.width, canvas.height);
        transformRatio = smallerDim < 400 ? smallerDim / 400 : 1;
        state.r = (smallerDim / 2) * 0.5; // Central chip radius smaller

        ctx.setTransform(transformRatio, 0, 0, -transformRatio, canvas.width / 2, canvas.height / 2);
    };
    setupCanvas();

    const createOrbitParticle = () => {
        state.particles.push({
            color: resolvedColor,
            radius: Math.random() * 2.5,
            x: Math.cos(Math.random() * 7 + Math.PI) * state.r,
            y: Math.sin(Math.random() * 7 + Math.PI) * state.r,
            ring: Math.random() * state.r * 3,
            move: (Math.random() * 4 + 1) / 500,
            random: Math.random() * 7,
            type: 'orbit',
            alpha: 1,
            targetR: state.r
        });
    };
    
    const createEmitterParticle = (startX: number, startY: number) => {
        const angle = Math.atan2(startY, startX) + Math.PI;
        const startRing = Math.sqrt(startX * startX + startY * startY);

        state.particles.push({
            color: resolvedColor,
            radius: Math.random() * 2.5,
            x: startX,
            y: startY,
            ring: startRing,
            move: (Math.random() * 2 + 1) / 100, // Emitters are a bit faster
            random: angle,
            type: 'emitter',
            alpha: 0, // Start invisible
            targetR: state.r
        });
    }

    for (let i = 0; i < particleCount; i++) createOrbitParticle();
    
    const canvasRect = canvas.getBoundingClientRect();
    if (emitterPositions.length > 0) {
        emitterPositions.forEach(pos => {
            for(let i = 0; i < 10; i++) { // 10 particles per emitter
                 const canvasX = (pos.x - canvasRect.left) / transformRatio - canvas.width / (2 * transformRatio);
                 const canvasY = -((pos.y - canvasRect.top) / transformRatio - canvas.height / (2 * transformRatio));
                 createEmitterParticle(canvasX, canvasY);
            }
        });
    }


    const moveParticle = (p: Particle) => {
      if (p.type === 'orbit') {
          p.ring = Math.max(p.ring - 1, state.r);
          p.random += p.move;
          p.x = Math.cos(p.random + Math.PI) * p.ring;
          p.y = Math.sin(p.random + Math.PI) * p.ring;
      } else { // Emitter
          p.alpha = Math.min(p.alpha + 0.05, 1);
          p.ring = Math.max(p.ring - 2, p.targetR); // Move toward center faster
          p.x = Math.cos(p.random) * p.ring;
          p.y = Math.sin(p.random) * p.ring;

          // When absorbed, become an orbit particle
          if (p.ring <= p.targetR) {
              p.type = 'orbit';
              p.random = Math.random() * 7; // Give it a new random orbit path
          }
      }
    };

    const resetParticle = (p: Particle) => {
      p.ring = Math.random() * state.r * 3;
      p.radius = Math.random() * 2.5;
    };

    const disappear = (p: Particle) => {
      if (p.type === 'orbit' && p.radius < 0.8) {
        resetParticle(p);
      }
      if (p.type === 'orbit') {
        p.radius *= 0.994;
      }
    };

    const draw = (p: Particle) => {
      ctx.beginPath();
      const [r, g, b] = rgbColor.current;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = () => {
      if (!canvas) return;
      ctx.clearRect(-canvas.width / transformRatio, -canvas.height / transformRatio, canvas.width * 2 / transformRatio, canvas.height * 2 / transformRatio);
      if (state.counter < state.particles.length) state.counter++;

      for (let i = 0; i < state.counter; i++) {
        const p = state.particles[i];
        disappear(p);
        moveParticle(p);
        draw(p);
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    const handleResize = () => {
      setupCanvas();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [particleCount, resolvedColor, emitterPositions]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: backgroundColor,
        pointerEvents: "none",
      }}
    />
  );
}