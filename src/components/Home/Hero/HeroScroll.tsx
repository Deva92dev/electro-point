"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { m, useScroll, useSpring, useTransform } from "@/components/motion";
import type { HeroImage } from "@/utils/types";
import { imagekitLoader } from "@/lib/imagekit-loader";

interface Props {
  images: HeroImage[];
}

const HeroScroll = ({ images }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const totalMovement = images.length * 440 + 600;
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -totalMovement]);
  const x = useSpring(xRaw, { stiffness: 90, damping: 20, mass: 1 });

  const imageYTransforms = [
    useTransform(scrollYProgress, [0, 1], [0, -48]),
    useTransform(scrollYProgress, [0, 1], [0, 48]),
    useTransform(scrollYProgress, [0, 1], [0, -48]),
    useTransform(scrollYProgress, [0, 1], [0, 48]),
    useTransform(scrollYProgress, [0, 1], [0, -48]),
    useTransform(scrollYProgress, [0, 1], [0, 48]),
    useTransform(scrollYProgress, [0, 1], [0, -48]),
  ];

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <m.div
        style={{ opacity }}
        className="sticky top-0 h-screen overflow-hidden bg-background"
      >
        <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative h-full flex flex-col pt-12 md:pt-16 lg:pt-20">
          <div className="px-4 md:px-8 lg:px-12 mb-8 md:mb-10 lg:mb-12">
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-[80rem] mx-auto"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-8">
                <div className="text-center md:text-left flex-1">
                  <h1 className="mb-6 text-gradient">Electro Point</h1>
                  <p className="text-xl text-muted-foreground mb-8">
                    Premium Electronics Collection
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <m.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Link
                      href="/products"
                      className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full overflow-hidden font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-brand-gradient opacity-100" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-md bg-brand-gradient" />
                      <span className="relative z-10 text-primary-foreground">
                        Explore Products
                      </span>
                      <svg
                        className="relative z-10 w-5 h-5 text-primary-foreground transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </m.div>
                  <m.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="hidden md:flex flex-col items-center gap-2 text-muted-foreground text-sm font-medium"
                  >
                    <span>Scroll</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </m.div>
                </div>
              </div>
            </m.div>
          </div>
          <div className="flex-grow flex items-center">
            <m.div
              style={{ x }}
              className="flex items-center gap-6 px-4 md:px-8"
            >
              {images.map((image, index) => {
                const imageUrl = imagekitLoader({
                  src: image.src,
                  transformations: {
                    width: 600,
                    height: 800,
                    crop: "at_max",
                    format: "auto",
                    progressive: true,
                    sharpen: 2,
                  },
                });

                return (
                  <m.div
                    key={image.id}
                    style={{ y: imageYTransforms[index] }}
                    className="relative flex-shrink-0 
                      w-hero-card-base h-hero-card-base
                      xs:w-hero-card-xs xs:h-hero-card-xs
                      sm:w-hero-card-sm sm:h-hero-card-sm
                      md:w-hero-card-md md:h-hero-card-md
                      lg:w-hero-card-lg lg:h-hero-card-lg
                      xl:w-hero-card-xl xl:h-hero-card-xl
                      2xl:w-hero-card-2xl 2xl:h-hero-card-2xl
                      rounded-xl overflow-hidden shadow-2xl group bg-card border border-border"
                  >
                    <Image
                      src={imageUrl}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 280px, (max-width: 1280px) 380px, 420px"
                      priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10 mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <span className="inline-block px-3 py-1 bg-secondary/90 backdrop-blur-md rounded-full text-secondary-foreground text-xs font-bold mb-2 border border-primary/20">
                        {image.category}
                      </span>
                      <h3 className="text-white text-xl font-bold line-clamp-2 leading-tight">
                        {image.alt}
                      </h3>
                    </div>
                  </m.div>
                );
              })}
            </m.div>
          </div>
          <div className="pb-12">
            <m.div
              className="mx-auto w-48 h-1 bg-muted rounded-full overflow-hidden"
              style={{ opacity }}
            >
              <m.div
                className="h-full bg-brand-gradient origin-left"
                style={{ scaleX: scrollYProgress }}
              />
            </m.div>
          </div>
        </div>
      </m.div>
    </div>
  );
};

export default HeroScroll;
