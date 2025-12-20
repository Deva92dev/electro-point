"use client";

import {
  useMotionValue,
  useSpring,
  useTransform,
  m,
  TargetAndTransition,
} from "@/components/motion";
import Image from "next/image";
import { MouseEvent } from "react";

interface Props {
  src: string;
  alt: string;
}

const TitanInteraction = ({ src, alt }: Props) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // smooth out the mouse movement
  const mouseX = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 30 });

  // map mouse positions to rotate degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  // floating animations
  const floatAnimation: TargetAndTransition = {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // calculate normalized mouse positions from center
    const mouseXPct = (e.clientX - rect.left) / width - 0.5;
    const mouseYPct = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseXPct);
    y.set(mouseYPct);
  };

  const handleMouseLeave = () => {
    // reset to center when motion leaves
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center perspective-1000 cursor-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1200px" }} // essential for 3D tilt
    >
      <m.div
        style={{ rotateX, rotateY }}
        animate={floatAnimation}
        className="relative w-[300px] md:w-[500px] lg:w-[600px] aspect-square z-20 "
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain drop-shadow-2xl"
          priority
          sizes="(max-width:768px) 100vw, 100vw"
          unoptimized
        />
      </m.div>
      {/* dynamic shadow moves opposite of the product */}
      <m.div
        style={{
          rotateX,
          rotateY,
          scale: 0.8,
          opacity: 0.4,
        }}
        className="absolute bottom-0 w-[60%] h-16 bg-black blur-[60px] rounded-[100%]"
      />
    </div>
  );
};

export default TitanInteraction;
