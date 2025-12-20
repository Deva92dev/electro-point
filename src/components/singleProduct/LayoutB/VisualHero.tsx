"use client";

import { ProductDetailsType } from "@/utils/types";
import { useState } from "react";
import { m, AnimatePresence } from "@/components/motion";
import { Share2, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FavoriteToggle from "@/components/product/FavoriteToggle";
import AddToCart from "@/components/cart/AddToCart";

type Props = {
  product: NonNullable<ProductDetailsType>;
  isFavorite?: boolean;
  isAuthenticated: boolean;
};

// will inject dynamic colored gradients based on the selected variant.

const VisualHero = ({ product, isFavorite = false }: Props) => {
  // Initial State
  const [activeImage, setActiveImage] = useState(
    product.images[0]?.url || product.mainImagePath
  );

  // Handle color access safely using the schema property 'availableColors'
  const initialColor = product.availableColors?.[0] || {
    name: "default",
    hex: "#333",
  };
  const [activeColorHex, setActiveColorHex] = useState(initialColor.hex);
  const [activeColorName, setActiveColorName] = useState(initialColor.name);

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

  // Click Handler
  const handleVariantClick = (
    imgUrl: string,
    colorName: string,
    colorHex: string
  ) => {
    setActiveImage(imgUrl);
    setActiveColorName(colorName);
    setActiveColorHex(colorHex);
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-12 bg-black">
      {/* Background Atmosphere */}
      <m.div
        className="absolute inset-0 z-0 opacity-40"
        animate={{
          background: `radial-gradient(circle at center, ${activeColorHex} 0%, transparent 70%)`,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full text-center pointer-events-none ">
        <h1 className="text-[12vw] font-black leading-none text-white/5 uppercase tracking-tighter select-none">
          {product.brand?.name}
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT: Info */}
        <div className="lg:col-span-3 space-y-6 text-center lg:text-left order-2 lg:order-1">
          <div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-yellow-400 mb-2">
                <Star className="fill-current w-4 h-4" />
                <span className="font-bold text-white">
                  {product.averageRating || "N/A"}
                </span>
                <span className="text-white/40 text-sm">
                  ({product.totalReviews} Reviews)
                </span>
              </div>
              <div className="flex gap-2">
                <FavoriteToggle
                  productId={product.id}
                  initialIsFavorite={isFavorite}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-2">
              {product.name}
            </h2>
            <p className="text-lg text-zinc-400">{activeColorName} Edition</p>
          </div>

          <div className="text-3xl font-light text-white">
            ₹{parseFloat(product.basePrice).toLocaleString()}
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {/* VARIANT MAPPING */}
            {product.variants && product.variants.length > 0
              ? product.variants.map((variant: any) => {
                  // Match variant color name to hex code from product.
                  const colorInfo = product.availableColors?.find(
                    (c: any) => c.name === variant.color
                  );
                  const hex = colorInfo?.hex || "#fff";

                  return (
                    <button
                      key={variant.id}
                      onClick={() =>
                        handleVariantClick(
                          variant.url || activeImage,
                          variant.color,
                          hex
                        )
                      }
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        activeColorName === variant.color
                          ? "border-white scale-110 ring-2 ring-white/20"
                          : "border-white/20 opacity-80 hover:opacity-100 hover:border-white hover:scale-105"
                      }`}
                      style={{ backgroundColor: hex }}
                      title={variant.color}
                    />
                  );
                })
              : product.availableColors?.map((c: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveColorName(c.name);
                      setActiveColorHex(c.hex);
                    }}
                    className="w-8 h-8 rounded-full border border-white/20"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
          </div>
        </div>

        {/* CENTER: Hero Image */}
        <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center h-[500px] items-center">
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <m.div
                key={activeImage}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={activeImage || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  priority
                  unoptimized
                />
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="lg:col-span-3 flex flex-col gap-4 justify-center order-3">
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
          <p className="text-center text-xs text-white/40">
            Free shipping on all orders. <br /> 30-day return policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisualHero;
