"use client";

import { useState } from "react";
import { GetProductBySlug } from "./data";
import Image from "next/image";
import { getProductDetails } from "@/lib/imagekit-loader";

interface Props {
  product: GetProductBySlug;
}

const GalleryProducts = ({ product }: Props) => {
  const reformedImage = product?.mainImagePath
    ? getProductDetails(encodeURI(product.mainImagePath))
    : "/placeholder.jpg";

  const [activeImage, setActiveImage] = useState(reformedImage);

  const handleImageChange = (imgUrl: string) => {
    setActiveImage(imgUrl);
  };
  // to change image upon clicking you have to change the source of truth which is your "activeImage" state

  return (
    <section className="w-full min-h-screen px-12 border-2 border-red-200">
      <div className="relative w-[500px] h-[500px] rounded-3xl border-2 border-red-500">
        <Image
          src={activeImage || ""}
          alt={product?.name as string}
          fill
          preload
          sizes="(max-width:768px) 100vw, 70vw"
          className="object-cover rounded-3xl"
        />
      </div>
      {/* for below images and change upon clicking */}
      <div className="flex flex-row gap-2 my-8">
        {product?.variants &&
          product.variants.map((img) => {
            const reformedAllImages = img.imagePath
              ? getProductDetails(encodeURI(img.imagePath))
              : "/placeholder.jpg";

            return (
              <div key={img.id}>
                <div className="w-24 h-24">
                  <Image
                    src={reformedAllImages}
                    alt={product?.name as string}
                    width={300}
                    height={300}
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="rounded-3xl object-cover"
                    onClick={() => handleImageChange(reformedAllImages)}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default GalleryProducts;
