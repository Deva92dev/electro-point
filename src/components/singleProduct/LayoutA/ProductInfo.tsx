"use client";

import AddToCart from "@/components/cart/AddToCart";
import FavoriteToggle from "@/components/product/FavoriteToggle";
import { Button } from "@/components/ui/button";
import { ProductDetailsType } from "@/utils/types";
import { formatPrice } from "@/utils/util";
import { Cpu, HardDrive, Monitor, Share2, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface InfoProps {
  product: NonNullable<ProductDetailsType>;
  isFavorite?: boolean;
  isAuthenticated: boolean;
}

// some functionality requires conditional rendering either laptop or tv
const ProductInfo = ({
  product,
  isFavorite = false,
  isAuthenticated,
}: InfoProps) => {
  const specs = product.specs as any;

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : undefined
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* header */}
      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider font-bold">
            <span>{product.brand?.name}</span>
            <span>.</span>
            <span>{product.category.name}</span>
          </div>
          <div className="flex gap-2 md:gap-4">
            <FavoriteToggle
              productId={product.id}
              initialIsFavorite={isFavorite}
            />
            <Button className="rounded-full text-white/70 cursor-pointer">
              <Share2 className="w-4 h-4" aria-label="share button" />
            </Button>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
          {product.name}
        </h1>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-4">
            {product.salePrice ? (
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(parseFloat(product.salePrice))}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(parseFloat(product.basePrice))}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary">
                {formatPrice(parseFloat(product.basePrice))}
              </span>
            )}
          </div>
          {/* Users need to pick a color before adding to cart */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Colors :
                <span className="text-foreground">
                  {selectedVariant?.color || "Default"}
                </span>
              </span>
              <div className="flex gap-2">
                {product.variants.map((v: any) => {
                  const colorInfo = product.availableColors?.find(
                    (c: any) => c.name === v.color
                  );
                  const hex = colorInfo?.hex || "#ccc";
                  const isSelected = selectedVariant?.id === v.id;

                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 scale-110"
                          : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: hex }}
                      title={v.color}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Key Features Grid (Quick Specs) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 bg-muted/30 border border-border flex flex-col gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          <span className="text-xs text-muted-foreground font-bold uppercase">
            Processor
          </span>
          <span className="font-semibold">
            {specs?.processorModel || specs?.chipset || "Standard"}
          </span>
        </div>
        <div className="rounded-2xl p-4 bg-muted/30 border border-border flex flex-col gap-2">
          <HardDrive className="w-5 h-5 text-primary" />
          <span className="text-xs text-muted-foreground font-bold uppercase">
            Storage / Ram
          </span>
          <span className="font-semibold">
            {specs?.storageSize || specs?.storage} /
            {specs?.ramSize || specs?.ram}
          </span>
        </div>
        <div className="rounded-2xl p-4 bg-muted/30 border border-border flex flex-col gap-2 col-spa">
          <Monitor className="w-5 h-5 text-primary" />
          <span className="text-xs text-muted-foreground font-bold uppercase">
            Display
          </span>
          <span className="font-semibold">
            {specs?.screenSize}" {specs?.screenType} ({specs?.screenResolution})
            {specs?.refreshRate ? `@ ${specs.refreshRate}Hz` : ""}
          </span>
        </div>
      </div>
      <div className="space-y-4 pt-4 border-t border-border">
        <AddToCart
          product={{
            id: product.id,
            name: product.name,
            basePrice: product.basePrice,
            salePrice: product.salePrice,
          }}
          // pass the sanitized version of selected Variant
          selectedVariant={
            selectedVariant
              ? {
                  id: selectedVariant.id,
                  color: selectedVariant.color || undefined,
                  image: selectedVariant.url || product.mainImagePath,
                  stock: selectedVariant.stockQuantity,
                }
              : undefined
          }
          currentImage={selectedVariant?.url || product.mainImagePath}
          isAuthenticated={isAuthenticated}
          className="w-full h-14 text-lg font-bold rounded-full shadow-xl shadow-primary/20"
        />
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>{product.warranty || "Official Warranty Included"}</span>
        </div>
      </div>
      {/* Deep Dive Specs */}
      <div className="pt-8 space-y-6">
        <h2 className="text-xl">Technical Specifications</h2>
        <div className="divide-y divide-border">
          {Object.entries(specs || {}).map(([key, value]) => {
            // Filter out internal keys like id, productId, dates
            if (["id", "productId", "createdAt", "updatedAt"].includes(key))
              return null;
            if (!value) return null;

            // Format Key: "processorModel" -> "Processor Model"
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            return (
              <div key={key} className="grid grid-cols-2 py-3 text-sm">
                <span className="text-muted-foreground font-medium">
                  {label}
                </span>
                <span className="text-foreground font-semibold text-right">
                  {String(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
