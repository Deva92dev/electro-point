"use client";

import { getHeroCard } from "@/lib/imagekit-loader";
import Image from "next/image";
import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "@/components/motion";
import { useRef } from "react";

interface CategoryHeroItemType {
  id: number;
  name: string;
  productType:
    | "laptop"
    | "smartphone"
    | "tablet"
    | "smartwatch"
    | "headphones"
    | "tv";
  imageUrl: string | null;
}

interface Props {
  results: CategoryHeroItemType[];
}

const HeroScrollEffect = ({ results }: Props) => {
  const ref = useRef(null);

  const { scrollY, scrollYProgress } = useScroll({
    container: ref,
  });

  // const {} = useTransform()

  return (
    <m.section ref={ref} className="p-4 flex flex-row gap-4" style={{}}>
      {results.map((item, index) => {
        const imageUrl = item.imageUrl
          ? getHeroCard(item.imageUrl)
          : "/placeholder.jpg";

        return (
          <div key={item.id} className="">
            <div className="relative w-96 h-hero-card-lg">
              <Image
                src={imageUrl}
                alt={item.name}
                fill
                preload={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover  rounded-xl"
              />
            </div>
          </div>
        );
      })}
    </m.section>
  );
};

export default HeroScrollEffect;
