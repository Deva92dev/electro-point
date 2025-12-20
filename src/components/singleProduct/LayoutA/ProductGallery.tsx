"use client";

import { useEffect, useState } from "react";
import { m } from "@/components/motion";
import Image from "next/image";

interface GalleryProps {
  images: { id: number; url: string; altText: string }[];
  productName: string;
}

const ProductGallery = ({ images, productName }: GalleryProps) => {
  const [activeImage, setActiveImage] = useState(images[0]?.url);
  // This ensures if the user navigates to a new product, the main image updates.
  useEffect(() => {
    if (images && images.length > 0) {
      setActiveImage(images[0]?.url);
    }
  }, [images]);

  if (!images.length) return null;

  return (
    <div className="space-y-4">
      {/* main hero image */}
      <m.div
        layoutId="main-image"
        className="relative w-full aspect-16/10 bg-muted/30 rounded-3xl overflow-hidden border border-border"
      >
        <Image
          src={activeImage || "/placeholder.jpg"}
          alt={productName}
          fill
          className="object-contain p-8"
          priority
          sizes="(max-width:1024px) 100vw, 60vw"
          unoptimized
        />
      </m.div>
      {/* Thumbnails Grid */}
      <div className="grid grid-cols-4 gap-4">
        {images.slice(0, 4).map((img) => (
          <button
            key={img.id}
            onClick={() => setActiveImage(img.url)}
            className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
              activeImage === img.url
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-border bg-muted/50"
            }`}
          >
            <Image
              src={img.url}
              alt={img.altText || productName}
              fill
              sizes="150px"
              className="object-contain p-2"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
