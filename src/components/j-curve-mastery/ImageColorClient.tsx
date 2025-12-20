"use client";

import { VariantsType } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  variants: {
    color: string | null;
    imagePath: string | null;
  }[];
  defaultColor: string | undefined;
  name: string;
  slug: string;
}

const ImageColorClient = ({ variants, name, slug, defaultColor }: Props) => {
  const calculatedIndex = defaultColor
    ? variants.findIndex((v) => v.color === defaultColor)
    : 0;

  const mainIndex = calculatedIndex >= 0 ? calculatedIndex : 0;

  const [activeVariant, setActiveVariant] = useState(mainIndex);
  const mainImage = variants[activeVariant]?.imagePath; // change color dynamically

  return (
    <>
      <Link href={`/products/${slug}`}>
        <div className="w-full aspect-3/4 rounded-2xl relative">
          <Image
            src={mainImage || ""}
            alt={name}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-full h-full"
          />
        </div>
      </Link>
      <div className="pt-8 px-4 flex flex-row gap-2">
        {variants.map((v: VariantsType, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full cursor-pointer border border-border/20 ${
              activeVariant === index
                ? "ring-2 ring-offset-2 ring-primary"
                : "ring-muted-foreground"
            }`}
            style={{ backgroundColor: v.color || "" }}
            onMouseEnter={() => setActiveVariant(index)} // change color on mouse Enter
          />
        ))}
      </div>
    </>
  );
};

export default ImageColorClient;
