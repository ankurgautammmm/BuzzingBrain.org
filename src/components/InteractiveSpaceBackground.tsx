import React, { useEffect, useRef } from 'react';

interface InteractiveSpaceBackgroundProps {
  children?: React.ReactNode;
}

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
  depth: number; // 0.1 to 1 for parallax
}

export const InteractiveSpaceBackground: React.FC<InteractiveSpaceBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isMoving: false,
      radius: 140,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isMoving = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isMoving = true;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Color palette for realistic cosmos: icy white, pale cyan, warm amber, violet, pastel gold
    const starColors = [
      '#ffffff',
      '#ffffff',
      '#e0f2fe',
      '#fef08a',
      '#fde047',
      '#c4b5fd',
      '#93c5fd',
    ];

    let stars: Star[] = [];
    const numStars = Math.min(220, Math.floor((width * height) / 6000));

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const depth = Math.random() * 0.9 + 0.1;
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.8 + 0.5,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
          depth,
        });
      }
    };

    initStars();

    let frame = 0;
    const render = () => {
      frame++;
      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const bgGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#060d1f'); // soft deep cosmic indigo around cursor
      bgGrad.addColorStop(0.4, '#040814'); // mid night space
      bgGrad.addColorStop(1, '#020409'); // outer pitch void
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle glowing cosmic dust cloud following cursor
      const nebulaGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        mouse.radius * 2
      );
      nebulaGrad.addColorStop(0, 'rgba(245, 158, 11, 0.07)'); // amber core
      nebulaGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)'); // indigo haze
      nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Render & update interactive stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Natural drifting
        star.baseX += star.vx;
        star.baseY += star.vy;
        if (star.baseX < 0) star.baseX = width;
        if (star.baseX > width) star.baseX = 0;
        if (star.baseY < 0) star.baseY = height;
        if (star.baseY > height) star.baseY = 0;

        // Interactive mouse gravity & repel physics
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // When cursor is placed on or near stars, they react interactively
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 25 * star.depth;
          // Soft displacement away from cursor + orbital swirl
          const angle = Math.atan2(dy, dx);
          star.x = star.baseX - Math.cos(angle) * force + Math.sin(angle) * force * 0.4;
          star.y = star.baseY - Math.sin(angle) * force - Math.cos(angle) * force * 0.4;
        } else {
          // Spring back smoothly to baseline
          star.x += (star.baseX - star.x) * 0.06;
          star.y += (star.baseY - star.y) * 0.06;
        }

        // Twinkle factor
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset);
        const opacity = Math.max(0.2, (twinkle + 1) / 2 * 0.85 + 0.15);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = star.color;

        // Glow around closer/larger stars
        if (star.size > 1.4) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = star.color;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point diffraction sparkle for bright prominent stars
        if (star.size > 1.8 && twinkle > 0.4) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          const beam = star.size * 2.5;
          ctx.beginPath();
          ctx.moveTo(star.x - beam, star.y);
          ctx.lineTo(star.x + beam, star.y);
          ctx.moveTo(star.x, star.y - beam);
          ctx.lineTo(star.x, star.y + beam);
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 print:hidden"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </>
  );
};
