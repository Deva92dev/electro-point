"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Share2, Star } from "lucide-react";
import { ProductDetailsType } from "@/utils/types";
import FavoriteToggle from "@/components/product/FavoriteToggle";
import AddToCart from "@/components/cart/AddToCart";
import { formatPrice } from "@/utils/util";

interface Props {
  product: NonNullable<ProductDetailsType>;
  isAuthenticated: boolean;
  isFavorite?: boolean;
}

const HeroConfigurator = ({ product, isFavorite = false }: Props) => {
  const initialColor = product.availableColors?.[0] || {
    name: "Default",
    hex: "#333",
  };

  const [activeColorName, setActiveColorName] = useState(initialColor.name);
  const [activeImage, setActiveImage] = useState(product.mainImagePath);

  const selectedVariantRaw = product.variants.find(
    (v: any) => v.color === activeColorName
  );
  const variantForCart = selectedVariantRaw
    ? {
        id: selectedVariantRaw.id,
        color: selectedVariantRaw.color || undefined,
        image: selectedVariantRaw.url || activeImage,
        stock: selectedVariantRaw.stockQuantity,
      }
    : undefined;

  const handleVariantClick = (imgUrl: string, colorName: string) => {
    setActiveImage(imgUrl);
    setActiveColorName(colorName);
  };

  // Combine main image + gallery for the scrollable feed
  const galleryImages = [
    { id: -1, url: activeImage, altText: "Main View" },
    ...product.images.filter((img) => img.url !== activeImage),
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
      {/* LEFT: Scrollable Media Feed (65%) */}
      {/* This creates the "Instagram" feel. You just scroll to see more. */}
      <div className="w-full lg:w-[65%] flex flex-col gap-4">
        {galleryImages.map((img, idx) => (
          <div
            key={img.id}
            className={`relative w-full overflow-hidden rounded-3xl bg-muted/20 border border-border ${
              idx === 0
                ? "aspect-square md:aspect-4/3"
                : "aspect-4/3 md:aspect-video"
            }`}
          >
            <Image
              src={img.url}
              alt={img.altText || product.name}
              fill
              className="object-contain p-8 hover:scale-105 transition-transform duration-700 ease-out"
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 70vw"
              unoptimized
            />
            {/* Subtle label for the first image */}
            {idx === 0 && (
              <div className="absolute top-6 left-6 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-border">
                {activeColorName} View
              </div>
            )}
          </div>
        ))}
      </div>

      {/* RIGHT: Sticky Configurator (35%) */}
      <div className="w-full lg:w-[35%] relative">
        <div className="sticky top-28 space-y-8">
          {/* Header */}
          <div className="space-y-4 border-b border-border pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">
                  {product.brand?.name} Collection
                </h2>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  {product.name}
                </h1>
              </div>
              <div className="flex gap-2">
                <FavoriteToggle
                  productId={product.id}
                  initialIsFavorite={isFavorite}
                />

                <Button className="rounded-full text-white/70 cursor-pointer">
                  <Share2 className="w-4 h-4" aria-label="share button" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-2xl font-light">
                {formatPrice(parseFloat(product.basePrice))}
              </span>
              {product.salePrice && (
                <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded">
                  Save{" "}
                  {Math.round(
                    ((Number(product.basePrice) - Number(product.salePrice)) /
                      Number(product.basePrice)) *
                      100
                  )}
                  %
                </span>
              )}
              <div className="ml-auto flex items-center gap-1 text-sm font-medium">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {product.averageRating}
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-6">
            {/* Color/Style Selector */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground">
                Selected Style:{" "}
                <span className="text-foreground font-bold">
                  {activeColorName}
                </span>
              </span>
              <div className="flex flex-wrap gap-3">
                {/* Map Variants */}
                {product.variants && product.variants.length > 0 ? (
                  product.variants.map((variant: any) => {
                    const colorInfo = product.availableColors?.find(
                      (c: any) => c.name === variant.color
                    );
                    const hex = colorInfo?.hex || "#ccc";
                    const isSelected = activeColorName === variant.color;

                    return (
                      <button
                        key={variant.id}
                        onClick={() =>
                          handleVariantClick(
                            variant.url || activeImage,
                            variant.color
                          )
                        }
                        className={`
                                        relative w-12 h-12 rounded-full border-2 transition-all duration-200
                                        ${
                                          isSelected
                                            ? "border-primary ring-2 ring-primary/30 scale-110"
                                            : "border-transparent hover:border-border hover:scale-105"
                                        }
                                    `}
                        style={{ backgroundColor: hex }}
                        title={variant.color}
                      >
                        {/* Inner white dot for dark colors if selected */}
                        {isSelected && (
                          <span className="absolute inset-0 m-auto w-4 h-4 bg-white/30 rounded-full backdrop-blur-sm" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Standard Edition
                  </p>
                )}
              </div>
            </div>

            {/* Spec Highlights (Mini) */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <span className="block text-muted-foreground text-xs uppercase mb-1">
                  Battery
                </span>
                <span className="font-semibold">
                  {(product.specs as any)?.batteryLife || "All Day"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <span className="block text-muted-foreground text-xs uppercase mb-1">
                  Connectivity
                </span>
                <span className="font-semibold">
                  {(product.specs as any)?.wifi ? "Wi-Fi + BT" : "Standard"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-6 border-t border-border">
            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                basePrice: product.basePrice,
                salePrice: product.salePrice,
              }}
              currentImage={activeImage}
              selectedVariant={variantForCart}
              className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-zinc-200 rounded-full transition-transform hover:scale-105"
            />
            <p className="text-center text-xs text-muted-foreground">
              Ships within 24 hours. Free returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroConfigurator;
