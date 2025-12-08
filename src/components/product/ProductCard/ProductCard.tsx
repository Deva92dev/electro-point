"use client";
import { Button } from "@/components/ui/button";
import { ProductsGridType } from "@/utils/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  product: ProductsGridType;
}

const ProductCard = ({ product }: Props) => {
  const [activeImage, setActiveImage] = useState(product.mainImagePath);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="group flex flex-col h-full space-y-3">
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-4/5 overflow-hidden rounded-xl bg-muted"
      >
        <Image
          src={activeImage}
          alt={product.name}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw "
        />
        {product.salePrice && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-full">
            SALE
          </div>
        )}
        {/* QUICK ADD BUTTON */}
        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button size="icon" className="rounded-full shadow-lg h-10 w-10">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </Link>

      {/* INFO AREA */}
      <div className="space-y-1">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-light truncate text-foreground">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          {product.salePrice ? (
            <>
              <span className="font-bold text-destructive">
                ₹{parseFloat(product.salePrice).toLocaleString()}
              </span>
              <span className="text-muted-foreground line-through text-sm">
                ₹{parseFloat(product.basePrice).toLocaleString()}
              </span>
            </>
          ) : (
            <span className="font-bold">
              ₹{parseFloat(product.basePrice).toLocaleString()}
            </span>
          )}
        </div>
        {/* COLOR SWATCHES  */}
        {product.variants.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 h-6">
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
                  // Support click for touch devices
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveImage(v.image);
                  }}
                  className={`w-4 h-4 rounded-full border border-border transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-primary ${
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
            {/* Color Label tooltip */}
            {hoveredColor && (
              <span className="text-[10px] text-muted-foreground ml-2 animate-in fade-in">
                {hoveredColor}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
