"use client";
import m from "motion/react-client";
import { useScroll, useTransform, useSpring } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

type CinematicHeroImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export default function CinematicHeroImage({
  src,
  alt,
  priority = true,
}: CinematicHeroImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Parallax scroll + cinematic zoom effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.2]), {
    stiffness: 80,
    damping: 20,
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "10%"]), {
    stiffness: 100,
    damping: 20,
  });

  return (
    <m.div
      ref={ref}
      style={{ scale, y }}
      className="absolute inset-0 will-change-transform"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={85}
        sizes="100vw"
        className="object-cover object-center"
      />
    </m.div>
  );
}
