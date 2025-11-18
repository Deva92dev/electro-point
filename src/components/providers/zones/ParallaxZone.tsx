"use client";

import { createContext, RefObject, useContext } from "react";
import { MotionValue, useTransform } from "@/components/motion";
import { useLenis } from "../LenisProvider";

interface ParallaxContextType {
  useParallax: (speed?: number) => MotionValue<number>; //moves based on scroll
  useSectionParallax: (
    ref: RefObject<HTMLElement>,
    speed?: number,
    range?: [number, number]
  ) => MotionValue<number>;
  useHorizontalParallax: (speed?: number) => MotionValue<number>;
  // Scale parallax - grows/shrinks on scroll
  useScaleParallax: (
    range?: [number, number],
    scale?: [number, number]
  ) => MotionValue<number>;
  // Opacity parallax - fades in/out
  useOpacityParallax: (
    range?: [number, number],
    opacity?: [number, number]
  ) => MotionValue<number>;
  useRotateParallax: (
    range?: [number, number],
    rotation?: [number, number]
  ) => MotionValue<number>;
  useLayeredParallax: (
    layer: number,
    maxLayers?: number
  ) => MotionValue<number>;
}

const ParallaxContext = createContext<ParallaxContextType | null>(null);

const ParallaxZone = ({ children }: { children: React.ReactNode }) => {
  const { scrollY } = useLenis();

  const useParallax = (speed: number = 0.5) => {
    return useTransform(scrollY, (value) => value * speed);
  };

  const useSectionParallax = (
    ref: RefObject<HTMLElement>,
    speed: number = 0.5,
    range: [number, number] = [0, 1]
  ) => {
    return useTransform(scrollY, (value) => {
      if (!ref.current) return 0;

      const rect = ref.current.getBoundingClientRect();
      const elementTop = window.scrollY + rect.top;
      const elementBottom = elementTop + rect.height;
      const viewportHeight = window.innerHeight;

      //   only animate when element is in viewport
      if (value < elementTop - viewportHeight) return range[0];
      if (value > elementBottom) return range[1];

      const scrollRange = elementBottom - (elementTop - viewportHeight);
      const scrolled = value - (elementTop - viewportHeight);
      const progress = scrolled / scrollRange;

      return progress * (range[1] - range[0]) * speed;
    });
  };

  const useHorizontalParallax = (speed: number = 0.3) => {
    return useTransform(scrollY, (value) => value * speed);
  };

  const useScaleParallax = (
    range: [number, number] = [0, 2000],
    scale: [number, number] = [1, 1.5]
  ) => {
    return useTransform(scrollY, range, scale);
  };

  const useOpacityParallax = (
    range: [number, number] = [0, 1000],
    opacity: [number, number] = [0, 1]
  ) => {
    return useTransform(scrollY, range, opacity);
  };

  const useRotateParallax = (
    range: [number, number] = [0, 2000],
    rotation: [number, number] = [0, 360]
  ) => {
    return useTransform(scrollY, range, rotation);
  };

  const useLayeredParallax = (layer: number, maxLayers: number = 5) => {
    const speed = (layer / maxLayers) * 0.5;
    return useTransform(scrollY, (value) => value * speed);
  };

  return (
    <ParallaxContext.Provider
      value={{
        useParallax,
        useSectionParallax,
        useHorizontalParallax,
        useScaleParallax,
        useOpacityParallax,
        useRotateParallax,
        useLayeredParallax,
      }}
    >
      {children}
    </ParallaxContext.Provider>
  );
};

export const useParallaxSystem = () => {
  const ctx = useContext(ParallaxContext);
  if (!ctx)
    throw new Error("useParallaxSystem must be used within ParallaxProvider");
  return ctx;
};

export default ParallaxZone;
