"use client";

import { createContext, useContext, useState } from "react";

interface InteractionContextType {
  isHovering: boolean;
  setHovering: (v: boolean) => void;
}

const InteractionContext = createContext<InteractionContextType | null>(null);

const InteractionZone = ({ children }: { children: React.ReactNode }) => {
  const [isHovering, setHovering] = useState(false);

  return (
    <InteractionContext.Provider value={{ isHovering, setHovering }}>
      {children}
    </InteractionContext.Provider>
  );
};

export default InteractionZone;

export const useInteraction = () => {
  const ctx = useContext(InteractionContext);
  if (!ctx)
    throw new Error("useInteraction must be used within InteractionZone");
  return ctx;
};
