"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  sparkColor?: string;
};

/** Лёгкая реакция на нажатие CTA: помогает почувствовать, что интерфейс услышал клик. */
export function ClickSpark({ children, className = "", sparkColor = "#ffcc00" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sparks: Array<{ x: number; y: number; angle: number; started: number }> = [];
    let frame = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onClick = (event: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const started = performance.now();
      for (let i = 0; i < 7; i += 1) sparks.push({ x, y, angle: (Math.PI * 2 * i) / 7, started });
    };
    const draw = (time: number) => {
      const rect = parent.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i];
        const progress = (time - spark.started) / 360;
        if (progress >= 1) { sparks.splice(i, 1); continue; }
        const eased = progress * (2 - progress);
        const distance = eased * 15;
        const length = 8 * (1 - eased);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(spark.x + Math.cos(spark.angle) * distance, spark.y + Math.sin(spark.angle) * distance);
        ctx.lineTo(spark.x + Math.cos(spark.angle) * (distance + length), spark.y + Math.sin(spark.angle) * (distance + length));
        ctx.stroke();
      }
      frame = requestAnimationFrame(draw);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    parent.addEventListener("click", onClick);
    frame = requestAnimationFrame(draw);
    return () => { observer.disconnect(); parent.removeEventListener("click", onClick); cancelAnimationFrame(frame); };
  }, [sparkColor]);

  return <span className={`click-spark ${className}`}><canvas ref={canvasRef} aria-hidden="true" />{children}</span>;
}
