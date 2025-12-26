"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { useInView } from "motion/react";

const Product3D = dynamic(() => import("./Product3D"), {
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900 rounded-3xl border border-white/10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 animate-pulse text-sm tracking-wider uppercase">
          Loading 3D Experience...
        </p>
      </div>
    </div>
  ),
  ssr: false,
});

const Lazy3DContainer = () => {
  const containerRef = useRef(null);

  // Detect when this div enters the viewport (once: true means it won't unload when you scroll away)
  const isInView = useInView(containerRef, {
    once: true,
    margin: "0px 0px -200px 0px",
  });

  // Adding a small state buffer to ensure hydration is stable
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShouldLoad(true);
    }
  }, [isInView]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px]">
      {shouldLoad ? <Product3D /> : null}
    </div>
  );
};

export default Lazy3DContainer;
