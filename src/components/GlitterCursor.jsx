import React, { useEffect, useRef } from 'react';

export default function GlitterCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth || document.documentElement.clientWidth;
      height = canvas.height = window.innerHeight || document.documentElement.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('orientationchange', resizeCanvas, { passive: true });

    const particles = [];
    const colors = [
      '#38BDF8', // Cyan Glow
      '#0EA5E9', // Sky Sparkle
      '#F59E0B', // Amber Gold
      '#FBBF24', // Warm Gold
      '#FFFFFF', // Diamond White
      '#34D399', // Emerald Shimmer
      '#C084FC'  // Violet Accent
    ];

    let animId = null;
    let isRunning = false;

    // 4-point diamond star
    const drawStar = (x, y, radius, color, alpha, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.shadowBlur = radius * 3;
      ctx.shadowColor = color;

      ctx.beginPath();
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

        px = cx + Math.cos(rot) * (radius * 0.3);
        py = cy + Math.sin(rot) * (radius * 0.3);
        ctx.lineTo(px, py);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    class Particle {
      constructor(x, y, isBurst = false) {
        this.x = x + (Math.random() - 0.5) * (isBurst ? 16 : 8);
        this.y = y + (Math.random() - 0.5) * (isBurst ? 16 : 8);
        this.size = Math.random() * (isBurst ? 5.5 : 4) + 2.5;
        this.originalSize = this.size;

        const angle = Math.random() * Math.PI * 2;
        const speed = isBurst ? Math.random() * 3.5 + 1.2 : Math.random() * 1.8 + 0.4;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed + 0.3;

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * (isBurst ? 0.03 : 0.024) + 0.018;
        this.rotation = Math.random() * Math.PI;
        this.rotSpeed = (Math.random() - 0.5) * 0.2;
        this.isStar = Math.random() > 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.96;
        this.speedY *= 0.96;
        this.rotation += this.rotSpeed;
        this.alpha -= this.decay;
        this.size *= 0.965;
      }

      draw() {
        if (this.alpha <= 0 || this.size <= 0.2) return;
        if (this.isStar) {
          drawStar(this.x, this.y, this.size, this.color, this.alpha, this.rotation);
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
          ctx.fillStyle = this.color;
          ctx.shadowBlur = this.size * 2.5;
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
      // Auto-correct canvas size if browser chrome/address bar resized viewport
      const curW = window.innerWidth || document.documentElement.clientWidth;
      const curH = window.innerHeight || document.documentElement.clientHeight;
      if (width !== curW || height !== curH) {
        width = canvas.width = curW;
        height = canvas.height = curH;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
        }
      }

      // Max particle safety cap for 60fps
      if (particles.length > 80) {
        particles.splice(0, particles.length - 80);
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const spawnParticles = (x, y, count = 2, isBurst = false) => {
      const clampedX = Math.max(0, Math.min(width || window.innerWidth, x));
      const clampedY = Math.max(0, Math.min(height || window.innerHeight, y));

      for (let i = 0; i < count; i++) {
        particles.push(new Particle(clampedX, clampedY, isBurst));
      }
      startLoop();
    };

    // 1. Mouse Move (Desktop)
    let lastMouseMove = 0;
    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - lastMouseMove > 18) {
        lastMouseMove = now;
        spawnParticles(e.clientX, e.clientY, Math.floor(Math.random() * 2) + 2, false);
      }
    };

    // 2. Click or Tap Anywhere -> Glitter Burst
    const handleClick = (e) => {
      const x = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (x !== undefined && y !== undefined) {
        spawnParticles(x, y, 9, true);
      }
    };

    // 3. Mobile Touch Start -> Instant Sparkle Burst
    const handleTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      spawnParticles(touch.clientX, touch.clientY, 8, true);
    };

    // 4. Mobile Touch Move (Slide Down / Scroll) -> Continuous Trail
    let lastTouchMove = 0;
    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const now = performance.now();
      if (now - lastTouchMove > 20) {
        lastTouchMove = now;
        spawnParticles(touch.clientX, touch.clientY, 3, false);
      }
    };

    // 5. Page Scroll (Mobile & Desktop Slide Down) -> Cascading sparkles
    let lastScroll = 0;
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastScroll > 35) {
        lastScroll = now;
        const curW = window.innerWidth || 360;
        const curH = window.innerHeight || 600;
        const rx = Math.random() * curW;
        const ry = Math.random() * (curH * 0.8) + 40;
        spawnParticles(rx, ry, 2, false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
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
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999999
      }}
    />
  );
}
