"use client";

import Lenis from "lenis";
import React, { createContext, useContext, useEffect } from "react";
import { MotionValue, useMotionValue } from "@/components/motion";

interface LenisContextType {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  velocity: MotionValue<number>;
  direction: MotionValue<number>;
}

const LenisContext = createContext<LenisContextType | null>(null);

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollY = useMotionValue(0);
  const velocity = useMotionValue(0);
  const direction = useMotionValue(1);
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      touchMultiplier: 1,
      wheelMultiplier: 1,
    });

    let lastScroll = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    const handleScroll = ({ scroll }: { scroll: number }) => {
      const delta = scroll - lastScroll;
      velocity.set(delta);
      direction.set(delta >= 0 ? 1 : -1);
      scrollY.set(scroll);
      lastScroll = scroll;

      // Compute normalized scroll progress
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scroll / maxScroll : 0;
      scrollYProgress.set(Math.min(Math.max(progress, 0), 1)); // clamp 0–1
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
      lenis.destroy();
    };
  }, [scrollY, scrollYProgress, velocity, direction]);

  return (
    <LenisContext.Provider
      value={{ scrollY, velocity, direction, scrollYProgress }}
    >
      {children}
    </LenisContext.Provider>
  );
};

export const useLenis = () => {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error("useLenis must be used within LenisProvider");
  return ctx;
};
