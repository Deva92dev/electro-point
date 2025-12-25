"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  LazyMotion,
  domAnimation,
  useMotionValue,
  MotionValue,
} from "@/components/motion";

interface LenisContextType {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  velocity: MotionValue<number>;
  direction: MotionValue<number>;
}

const LenisContext = createContext<LenisContextType | null>(null);

export const ClientProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Motion Logic: Reduced Motion Check
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldAnimate(!mediaQuery.matches);

    const handleChange = () => setShouldAnimate(!mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Lenis Logic: Scroll Physics State
  const scrollY = useMotionValue(0);
  const scrollYProgress = useMotionValue(0);
  const velocity = useMotionValue(0);
  const direction = useMotionValue(1);

  useEffect(() => {
    // Optional: Only initialize Lenis if not mobile/touch to save battery?
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

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scroll / maxScroll : 0;
      scrollYProgress.set(Math.min(Math.max(progress, 0), 1));
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
      lenis.destroy();
    };
  }, [scrollY, scrollYProgress, velocity, direction]);

  return (
    <LazyMotion features={domAnimation} strict>
      <LenisContext.Provider
        value={{ scrollY, velocity, direction, scrollYProgress }}
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </NextThemesProvider>
      </LenisContext.Provider>
    </LazyMotion>
  );
};

export const useLenis = () => {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error("useLenis must be used within ClientProviders");
  return ctx;
};
