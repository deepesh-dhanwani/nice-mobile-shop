import React, { useEffect, useRef } from 'react';

export default function GlitterCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
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
    window.addEventListener('resize', handleResize, { passive: true });

    const particles = [];
    const colors = [
      '#38BDF8', // Electric Cyan
      '#0EA5E9', // Sky Blue
      '#F59E0B', // Amber Gold
      '#FBBF24', // Yellow Gold
      '#FFFFFF', // Diamond White
      '#34D399', // Emerald Sparkle
      '#E0F2FE'  // Ice Glow
    ];

    let animId = null;
    let isRunning = false;

    // 4-point diamond sparkle star
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
        this.size = Math.random() * (isBurst ? 6 : 4) + 3;
        this.originalSize = this.size;

        const angle = Math.random() * Math.PI * 2;
        const speed = isBurst ? Math.random() * 3.5 + 1.2 : Math.random() * 1.8 + 0.4;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed + 0.4; // slight gravity drift

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * (isBurst ? 0.03 : 0.025) + 0.02;
        this.rotation = Math.random() * Math.PI;
        this.rotSpeed = (Math.random() - 0.5) * 0.2;
        this.isStar = Math.random() > 0.35; // 65% stars, 35% glowing circles
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.96;
        this.speedY *= 0.96;
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
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
        }
      }

      // Cap max particles for 60fps mobile efficiency
      if (particles.length > 70) {
        particles.splice(0, particles.length - 70);
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(render);
      } else {
        isRunning = false;
      }
    };

    const spawnParticles = (x, y, count = 2, isBurst = false) => {
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, isBurst));
      }
      startLoop();
    };

    // 1. Desktop Mouse Move
    let lastMouseMove = 0;
    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - lastMouseMove > 18) {
        lastMouseMove = now;
        spawnParticles(e.clientX, e.clientY, Math.floor(Math.random() * 2) + 2, false);
      }
    };

    // 2. Click Anywhere on Desktop or Mobile -> Glitter Burst!
    const handleClick = (e) => {
      const x = e.clientX || (e.touches && e.touches[0]?.clientX);
      const y = e.clientY || (e.touches && e.touches[0]?.clientY);
      if (x !== undefined && y !== undefined) {
        spawnParticles(x, y, 9, true); // Burst of 9 sparkles on click/tap
      }
    };

    // 3. Mobile Touch Start -> Burst of sparkles at finger touch
    const handleTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      spawnParticles(touch.clientX, touch.clientY, 7, true);
    };

    // 4. Mobile Touch Move (Slide Down / Scroll / Swipe) -> Continuous glitter trail!
    let lastTouchMove = 0;
    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const now = performance.now();
      if (now - lastTouchMove > 24) {
        lastTouchMove = now;
        spawnParticles(touch.clientX, touch.clientY, 3, false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
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
