/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useMotionValue } from "@/components/motion";

interface DirectionContextType {
  direction: any;
}

const DirectionContext = createContext<DirectionContextType | null>(null);

export const DirectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const direction = useMotionValue(1);

  // check it if it is good or not
  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const current = window.scrollY;
      direction.set(current > lastY ? 1 : -1);
      lastY = current;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [direction]);

  return (
    <DirectionContext.Provider value={{ direction }}>
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirection = () => {
  const ctx = useContext(DirectionContext);
  if (!ctx)
    throw new Error("useDirection must be used within DirectionProvider");
  return ctx;
};
