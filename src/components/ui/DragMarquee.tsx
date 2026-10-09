"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/src/lib/cn";

type DragMarqueeProps = {
  children: ReactNode;
  direction?: "left" | "right";
  /** Auto speed in pixels per second */
  speed?: number;
  /** Gap between children in px */
  gap?: number;
  draggable?: boolean;
  pauseOnHover?: boolean;
  /** Adds a linear-gradient mask to fade the left/right edges */
  fade?: boolean;
  ariaLabel?: string;
  className?: string;
  onProgress?: (progress: number) => void;
  hideCursor?: boolean;
};

export function DragMarquee({
  children,
  direction = "left",
  speed = 40,
  gap = 24,
  draggable = true,
  pauseOnHover = true,
  fade = false,
  ariaLabel = "Marquee",
  className,
  onProgress,
  hideCursor = false,
}: DragMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  const [repeats, setRepeats] = useState<number>(2);

  const reduceMotion = useReducedMotion();

  const state = useRef({
    x: 0,
    velocity: direction === "right" ? speed : -speed,
    baseVelocity: direction === "right" ? speed : -speed,
    isDragging: false,
    dragStartPoint: 0,
    dragStartX: 0,
    lastTime: 0,
    lastPoint: 0,
    pointerDownTime: 0,
    distanceDragged: 0,
    isHovered: false,
    isVisible: true,
    isHidden: false,
    isPaused: false,
    setWidth: 0,
  });

  const rafId = useRef<number>(0);

  const measure = useCallback(() => {
    if (!containerRef.current || !setRef.current) return;
    const cWidth = containerRef.current.offsetWidth;
    const sWidth = setRef.current.offsetWidth + gap;
    state.current.setWidth = sWidth;

    if (sWidth > 0 && cWidth > 0) {
      const needed = Math.ceil((cWidth * 2) / sWidth) + 1;
      if (needed !== repeats) setRepeats(needed);
    }
  }, [gap, repeats]);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    if (setRef.current) observer.observe(setRef.current);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ob = new IntersectionObserver((entries) => {
      state.current.isVisible = entries[0].isIntersecting;
    });
    ob.observe(containerRef.current);
    return () => ob.disconnect();
  }, []);

  useEffect(() => {
    const handleVis = () => {
      state.current.isHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVis);

    let pollId: number;
    const pollPaused = () => {
      state.current.isPaused = document.documentElement.getAttribute("data-paused") === "true";
      pollId = requestAnimationFrame(pollPaused);
    };
    pollId = requestAnimationFrame(pollPaused);

    return () => {
      document.removeEventListener("visibilitychange", handleVis);
      cancelAnimationFrame(pollId);
    };
  }, []);

  useEffect(() => {
    const s = state.current;
    const newBase = reduceMotion ? 0 : direction === "right" ? speed : -speed;
    s.baseVelocity = newBase;
    if (!s.isDragging) s.velocity = newBase;
  }, [direction, speed, reduceMotion]);

  useEffect(() => {
    const s = state.current;
    let didRunProgress = false;
    if (s.lastTime === 0) s.lastTime = Date.now();

    const loop = () => {
      const time = Date.now();
      const dt = Math.min((time - s.lastTime) / 1000, 0.1);
      s.lastTime = time;

      const shouldAutoPlay =
        !s.isHovered &&
        !s.isHidden &&
        s.isVisible &&
        !s.isPaused &&
        !reduceMotion;

      if (!s.isDragging) {
        const diff = s.baseVelocity - s.velocity;
        if (Math.abs(diff) > 1) {
          s.velocity += diff * 12 * dt;
        } else {
          s.velocity = shouldAutoPlay ? s.baseVelocity : 0;
        }
      }

      s.x += s.velocity * dt;

      if (s.setWidth > 0 && Math.abs(s.velocity) > 0) {
        s.x = ((s.x % s.setWidth) + s.setWidth) % s.setWidth;
        const finalX = s.x - s.setWidth;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${finalX}px, 0, 0)`;
        }

        if (onProgress && (!didRunProgress || time % 3 === 0)) {
          didRunProgress = true;
          // Normalize to [0...1]
          const pct = Math.abs(s.x) / s.setWidth;
          // Invert mapping for left direction since scrolling left decreases X essentially causing inverted bar visual
          onProgress(direction === 'right' ? pct : 1 - pct);
        }
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [reduceMotion, onProgress, direction]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    const s = state.current;
    s.isDragging = true;
    s.dragStartPoint = e.clientX;
    s.dragStartX = s.x;
    s.lastPoint = e.clientX;
    s.pointerDownTime = Date.now();
    s.distanceDragged = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
    if (!hideCursor && containerRef.current) containerRef.current.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (s.isDragging) {
      if (e.buttons === 0) {
         onPointerUp(e);
         return;
      }
      const dx = e.clientX - s.dragStartPoint;
      s.distanceDragged = Math.abs(dx);
      s.x = s.dragStartX + dx;

      const deltaX = e.clientX - s.lastPoint;
      // eslint-disable-next-line react-hooks/purity
      const t = Date.now();
      const dt = Math.max((t - s.lastTime) / 1000, 0.001);
      s.velocity = deltaX / dt;

      s.lastPoint = e.clientX;
      s.lastTime = t;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    const s = state.current;
    s.isDragging = false;
    (e.target as Element).releasePointerCapture(e.pointerId);
    if (!hideCursor && containerRef.current) containerRef.current.style.cursor = "grab";

    if (s.distanceDragged < 6) {
      s.velocity = s.baseVelocity;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!draggable) return;
    const s = state.current;
    const nudge = 240;
    if (e.key === "ArrowLeft") {
      s.velocity = -nudge * 3;
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      s.velocity = nudge * 3;
      e.preventDefault();
    }
  };

  const captureClick = (e: React.MouseEvent) => {
    if (state.current.distanceDragged > 6) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const onMouseEnter = () => {
    if (pauseOnHover) state.current.isHovered = true;
  };

  const onMouseLeave = () => {
    if (pauseOnHover) state.current.isHovered = false;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate overflow-x-clip outline-none",
        fade && "[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]",
        hideCursor && "cursor-none",
        className
      )}
      tabIndex={draggable ? 0 : -1}
      role="region"
      aria-roledescription="marquee"
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClickCapture={captureClick}
      style={{
        cursor: hideCursor ? "none" : draggable ? "grab" : undefined,
        touchAction: "pan-y",
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max items-stretch h-full will-change-transform"
        style={{ gap }}
      >
        <div ref={setRef} className="flex shrink-0 items-stretch h-full" style={{ gap }}>
          {children}
        </div>
        {Array.from({ length: Math.max(0, repeats - 1) }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-stretch h-full" style={{ gap }} aria-hidden="true">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}