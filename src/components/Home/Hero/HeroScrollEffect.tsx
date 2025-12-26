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
    offset: ["start 70%", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section ref={carouselRef} className="relative w-full overflow-x-hidden">
      <m.div
        className="flex gap-6 pl-4 md:pl-8 lg:pl-12 w-max py-4 pr-12"
        style={{ x }}
      >
        {results.map((item, index) => (
          <HeroCard key={item.id} item={item} index={index} />
        ))}
      </m.div>
    </section>
  );
};

export default HeroScrollEffect;
