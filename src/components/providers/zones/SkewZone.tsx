/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { createContext, RefObject, useContext } from "react";
import { MotionValue, useTransform } from "@/components/motion";
import { useLenis } from "../LenisProvider";
import { useDirection } from "../DirectionProvider";
import { useMouse } from "./MouseZone";

interface SkewContextType {
  useScrollSkew: (
    intensity?: number,
    axis?: "x" | "y" | "both"
  ) => { skewX: MotionValue<number>; skewY: MotionValue<number> };
  // Velocity-based skew (faster scroll = more skew)
  useVelocitySkew: (
    intensity?: number,
    axis?: "x" | "y"
  ) => MotionValue<number>;
  useDirectionSkew: (intensity?: number) => MotionValue<number>;
  useSectionSkew: (
    ref: RefObject<HTMLElement>,
    intensity?: number,
    range?: [number, number]
  ) => {
    skewX: MotionValue<number>;
    skewY: MotionValue<number>;
  };
  useMouseSkew: (
    ref: RefObject<HTMLElement>,
    intensity?: number
  ) => {
    skewX: MotionValue<number>;
    skewY: MotionValue<number>;
  };
  useHoverSkew: (
    isHovering: boolean,
    intensity?: number
  ) => {
    skewX: number;
    skewY: number;
  };
}

const SkewContext = createContext<SkewContextType | null>(null);

const SkewZone = ({ children }: { children: React.ReactNode }) => {
  const { scrollY, scrollYProgress, velocity } = useLenis();
  const { direction } = useDirection();

  const useScrollSkew = (
    intensity: number = 3,
    axis: "x" | "y" | "both" = "y"
  ) => {
    const transformXVirOne = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [0, intensity, 0]
    );
    const transformXVirTwo = useTransform(scrollYProgress, () => 0);
    const transformYVirOne = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [intensity, 0, -intensity]
    );
    const transformYVirTwo = useTransform(scrollYProgress, () => 0);

    const skewX =
      axis === "x" || axis === "both" ? transformXVirOne : transformXVirTwo;

    const skewY =
      axis === "y" || axis === "both" ? transformYVirOne : transformYVirTwo;

    return { skewX, skewY };
  };

  const useVelocitySkew = (
    intensity: number = 3,
    axis: "x" | "y" | "both" = "y"
  ) => {
    return useTransform(
      velocity,
      [-100, 0, 100],
      [
        axis === "x" ? -intensity : intensity,
        0,
        axis === "y" ? intensity : -intensity,
      ]
    );
  };

  const useDirectionSkew = (intensity: number = 2) => {
    return useTransform(direction, [-1, 1], [intensity, -intensity]);
  };

  const useSectionSkew = (
    ref: RefObject<HTMLElement>,
    intensity: number = 8,
    range: [number, number] = [-8, 8]
  ) => {
    const skewX = useTransform(scrollY, (value) => {
      if (!ref.current) return 0;

      const rect = ref.current.getBoundingClientRect();
      const elementTop = window.scrollY + rect.top;
      const elementBottom = elementTop + rect.height;
      const viewportHeight = window.innerHeight;

      if (value < elementTop - viewportHeight) return range[0];
      if (value > elementBottom) return range[1];

      const scrollRange = elementBottom - (elementTop - viewportHeight);
      const scrolled = value - (elementTop - viewportHeight);
      const progress = scrolled / scrollRange;

      return range[0] + progress * (range[1] - range[0]);
    });

    const skewY = useTransform(scrollY, (value) => {
      if (!ref.current) return 0;

      const rect = ref.current.getBoundingClientRect();
      const elementTop = window.scrollY + rect.top;
      const elementBottom = elementTop + rect.height;
      const viewportHeight = window.innerHeight;

      if (value < elementTop - viewportHeight) return -range[0];
      if (value > elementBottom) return -range[1];

      const scrollRange = elementBottom - (elementTop - viewportHeight);
      const scrolled = value - (elementTop - viewportHeight);
      const progress = scrolled / scrollRange;

      return -range[0] + progress * (-range[1] + range[0]);
    });

    return { skewX, skewY };
  };

  const useMouseSkew = (
    ref: RefObject<HTMLElement>,
    intensity: number = 10
  ) => {
    const { x: mouseX, y: mouseY } = useMouse();

    const skewX = useTransform(mouseX, (mx: number) => {
      if (!ref.current) return 0;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distance = (mx - centerX) / (rect.width / 2);

      return distance * intensity;
    });

    const skewY = useTransform(mouseY, (my: number) => {
      if (!ref.current) return 0;

      const rect = ref.current.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const distance = (my - centerY) / (rect.height / 2);

      return distance * intensity;
    });

    return { skewX, skewY };
  };

  const useHoverSkew = (isHovering: boolean, intensity: number = 5) => {
    return {
      skewX: isHovering ? intensity : 0,
      skewY: isHovering ? -intensity / 2 : 0,
    };
  };

  return (
    <SkewContext.Provider
      value={{
        useScrollSkew,
        useVelocitySkew,
        useDirectionSkew,
        useSectionSkew,
        useMouseSkew,
        useHoverSkew,
      }}
    >
      {children}
    </SkewContext.Provider>
  );
};

export const useSkew = () => {
  const ctx = useContext(SkewContext);
  if (!ctx) throw new Error("useSkew must be used within SkewProvider");
  return ctx;
};

export default SkewZone;
