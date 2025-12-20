"use client";

import { m, useScroll, useTransform } from "@/components/motion";
import { useRef } from "react";
import HeroCard from "./HeroCard";
import { StaticImageData } from "next/image";

export interface CategoryHeroItemType {
  id: number;
  imageUrl: string | StaticImageData;
  alt: string;
  productType: string;
}

interface Props {
  results: CategoryHeroItemType[];
}

const HeroScrollEffect = ({ results }: Props) => {
  const carouselRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: carouselRef,
    axis: "y",
    offset: ["start end", "end start"],
  });
  const input = [0, 1];
  const output = ["0%", "-40%"];
  const x = useTransform(scrollYProgress, input, output);

  return (
    <section
      ref={carouselRef}
      className="w-full py-12 lg:py-24 overflow-x-hidden bg-background"
    >
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-xl md:text-2xl font-medium tracking-tight text-muted-foreground">
          Explore Collections
        </h2>
      </div>
      <m.div className="flex gap-6 pl-4 md:pl-12 w-max" style={{ x }}>
        {results.map((item, index) => (
          <HeroCard key={item.id} item={item} index={index} />
        ))}
      </m.div>
    </section>
  );
};

export default HeroScrollEffect;
