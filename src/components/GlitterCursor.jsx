import React, { useEffect, useRef } from 'react';

export default function GlitterCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only run on desktop/devices with a mouse cursor
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const colors = [
      '#38BDF8', // Cyan
      '#0EA5E9', // Sky blue
      '#F59E0B', // Amber gold
      '#FBBF24', // Warm gold
      '#FFFFFF', // Pure diamond white
      '#6EE7B7'  // Mint sparkle
    ];

    let mouseX = -100;
    let mouseY = -100;
    let animId = null;
    let isRunning = false;

    // 4-point sparkle star drawer
    const drawStar = (x, y, radius, color, alpha, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.shadowBlur = radius * 3;
      ctx.shadowColor = color;

      ctx.beginPath();
      // Draw 4-point diamond star
      const spikes = 4;
      const step = Math.PI / spikes;
      let rot = (Math.PI / 2) * 3;
      let cx = 0;
      let cy = 0;

      for (let i = 0; i < spikes; i++) {
        let px = cx + Math.cos(rot) * radius;
        let py = cy + Math.sin(rot) * radius;
        ctx.lineTo(px, py);
        rot += step;

        px = cx + Math.cos(rot) * (radius * 0.35);
        py = cy + Math.sin(rot) * (radius * 0.35);
        ctx.lineTo(px, py);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    class Particle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 8;
        this.y = y + (Math.random() - 0.5) * 8;
        this.size = Math.random() * 5 + 3;
        this.originalSize = this.size;
        this.speedX = (Math.random() - 0.5) * 1.8;
        this.speedY = Math.random() * 1.5 - 0.5; // slight downward drift
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.025 + 0.02; // lifespan
        this.rotation = Math.random() * Math.PI;
        this.rotSpeed = (Math.random() - 0.5) * 0.15;
        this.isStar = Math.random() > 0.3; // 70% sparkles, 30% soft circles
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotSpeed;
        this.alpha -= this.decay;
        this.size *= 0.96;
      }

      draw() {
        if (this.alpha <= 0 || this.size <= 0.2) return;
        if (this.isStar) {
          drawStar(this.x, this.y, this.size, this.color, this.alpha, this.rotation);
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
          ctx.fillStyle = this.color;
          ctx.shadowBlur = this.size * 2;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        render();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
        }
      }

      // If particles still exist, keep rendering loop running
      if (particles.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    let lastSpawn = 0;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const now = performance.now();
      // Throttle slightly to create a balanced glitter trail without clustering
      if (now - lastSpawn > 16) {
        lastSpawn = now;
        // Spawn 2-3 sparkle particles per move step
        const count = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(mouseX, mouseY));
        }
        startLoop();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999999
      }}
    />
  );
}
