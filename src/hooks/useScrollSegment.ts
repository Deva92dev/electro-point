"use client";

import { MotionValue, useSpring, useTransform } from "@/components/motion";

// The useScrollSegment hook is designed for global scroll (pixel-based ranges like [0][2000]) not section based like hero etc
export const useScrollSegment = (
  scrollY: MotionValue<number>,
  input: number[],
  output: number[],
  springEnabled = true
) => {
  // always call the hook, don't do conditionally
  const transformed = useTransform(scrollY, input, output, { clamp: true });
  const springValue = useSpring(transformed, { stiffness: 120, damping: 20 });

  return springEnabled ? springValue : transformed;
};
