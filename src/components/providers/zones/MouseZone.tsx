/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect } from "react";
import { useMotionValue } from "@/components/motion";

interface MouseContextType {
  x: any;
  y: any;
}

const MouseContext = createContext<MouseContextType | null>(null);

const MouseZone = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <MouseContext.Provider value={{ x, y }}>{children}</MouseContext.Provider>
  );
};

export default MouseZone;

export const useMouse = () => {
  const ctx = useContext(MouseContext);
  if (!ctx) throw new Error("useMouse must be used within MouseZone");
  return ctx;
};
