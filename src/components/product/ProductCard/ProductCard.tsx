"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import FavoriteToggle from "../FavoriteToggle";
import AddToCart from "@/components/cart/AddToCart";
import { formatPrice } from "@/utils/util";

export interface ProductTypes {
  isFavorite: boolean;
  mainImagePath: string;
  variants: {
    id: number;
    color: string | null;
    image: string;
    stock: number;
  }[];
  id: number;
  name: string;
  slug: string;
  availableColors:
    | {
        name: string;
        hex: string;
      }[]
    | null;
  basePrice: string;
  salePrice: string | null;
  brand: {
    name: string;
  } | null;
  category: {
    name: string;
  };
}
interface Props {
  product: ProductTypes;
  isAuthenticated: boolean;
}

const ProductCard = ({ product, isAuthenticated }: Props) => {
  const [activeImage, setActiveImage] = useState(product.mainImagePath);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const selectedVariant =
    product.variants.find((v) => v.color === hoveredColor) ||
    product.variants.find((v) => v.image === activeImage) ||
    product.variants[0];

  const variantForCart = selectedVariant
    ? {
        id: selectedVariant.id,
        image: selectedVariant.image,
        stock: selectedVariant.stock,
        color: selectedVariant.color ?? undefined,
      }
    : undefined;

  return (
    <div className="group flex flex-col h-full space-y-4">
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-4/5 overflow-hidden rounded-xl bg-muted"
      >
        <Image
          src={activeImage}
          alt={product.name}
          fill
          loading="lazy"
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw"
        />
        {product.salePrice && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-full">
            SALE
          </div>
        )}

        {isAuthenticated && (
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FavoriteToggle
              productId={product.id}
              initialIsFavorite={!!product.isFavorite}
            />
          </div>
        )}

        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
          <AddToCart
            product={{
              id: product.id,
              name: product.name,
              basePrice: product.basePrice,
              salePrice: product.salePrice,
            }}
            selectedVariant={variantForCart}
            currentImage={activeImage}
            isAuthenticated={isAuthenticated}
            className="rounded-full shadow-lg h-10 w-10 p-0"
          />
        </div>
      </Link>

      {/* INFO AREA */}
      <div className="space-y-1">
        <Link href={`/products/${product.id}`} className="block">
          <h2 className="truncate text-foreground font-light">
            {product.name}
          </h2>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          {product.salePrice ? (
            <>
              <span className="font-bold text-destructive">
                {formatPrice(parseFloat(product.salePrice))}
              </span>
              <span className="text-muted-foreground line-through text-sm">
                {formatPrice(parseFloat(product.basePrice))}
              </span>
            </>
          ) : (
            <span className="font-bold">
              {formatPrice(parseFloat(product.basePrice))}
            </span>
          )}
        </div>

        {/* COLOR SWATCHES */}
        {product.variants.length > 0 && (
          <div className="relative flex items-center gap-3 mt-3 min-h-6">
            <div className="absolute -top-5 left-0 h-4 flex items-center pointer-events-none">
              <span
                className={`text-[10px] text-muted-foreground transition-opacity duration-200 ${
                  hoveredColor ? "opacity-100" : "opacity-0"
                }`}
              >
                {hoveredColor || ""}
              </span>
            </div>

            {product.variants.slice(0, 5).map((v, i) => {
              const colorInfo = product.availableColors?.find(
                (c) => c.name === v.color
              );
              const hexCode = colorInfo ? colorInfo.hex : "#acc";

              return (
                <button
                  key={i}
                  onMouseEnter={() => {
                    setActiveImage(v.image);
                    setHoveredColor(v.color);
                  }}
                  onMouseLeave={() => setHoveredColor(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveImage(v.image);
                  }}
                  className={`w-6 h-6 rounded-full border border-border transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-primary ${
                    activeImage === v.image
                      ? "ring-1 ring-primary ring-offset-1"
                      : ""
                  }`}
                  style={{ backgroundColor: hexCode }}
                  aria-label={`Select ${v.color}`}
                />
              );
            })}
            {product.variants.length > 5 && (
              <span className="text-[10px] text-muted-foreground">
                +{product.variants.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
