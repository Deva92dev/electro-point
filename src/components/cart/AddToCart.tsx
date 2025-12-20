"use client";

import { CartItem, useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  product: {
    id: number;
    name: string;
    basePrice: string;
    salePrice: string | null;
    stock?: number; // Added optional stock for single-SKU products
    lowStockThreshold?: number; // Added optional threshold
  };
  selectedVariant?: {
    id?: number;
    color?: string;
    image?: string;
    stock?: number;
    lowStockThreshold?: number;
  };
  currentImage: string; // image currently shown on screen
  className?: string;
  children?: React.ReactNode;
}

const AddToCart = ({
  product,
  currentImage,
  selectedVariant,
  className,
  children,
}: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const pathname = usePathname();

  // Determine Effective Stock & Threshold
  const effectiveStock = selectedVariant?.stock ?? product.stock ?? 5;
  const effectiveThreshold =
    selectedVariant?.lowStockThreshold ?? product.lowStockThreshold ?? 5;
  const isOutOfStock = effectiveStock === 0;

  const handleAddProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    const price = product.salePrice
      ? Number(product.salePrice)
      : Number(product.basePrice);

    const itemToAdd: CartItem = {
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: price,
      image: selectedVariant?.image || currentImage,
      color: selectedVariant?.color || "Default",
      quantity: 1,
      maxStock: effectiveStock,
      lowStockThreshold: effectiveThreshold,
    };

    addItem(itemToAdd);

    // fallback animation
    setIsAdded(true);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isAdded) {
      timeout = setTimeout(() => setIsAdded(false), 2000);
    }
    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [isAdded]);

  const renderContent = () => {
    if (children) return children;
    if (pathname === "/products")
      return <ShoppingCart className="w-5 h-5 cursor-pointer" />;

    // If out of stock
    if (isOutOfStock) return "Out of Stock";

    return (
      <>
        <ShoppingCart className="w-5 h-5" /> Add To Cart
      </>
    );
  };

  return (
    <Button
      size="lg"
      onClick={handleAddProduct}
      disabled={isOutOfStock || isAdded} // Disable if OOS or currently animating
      className={cn(
        "relative transition-all duration-300 overflow-hidden cursor-pointer",
        isAdded ? "bg-green-600 hover:bg-green-700 text-white" : "",
        isOutOfStock
          ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted"
          : "",
        className
      )}
    >
      <div
        className={`flex items-center justify-center gap-2 transition-transform duration-300 ${
          isAdded ? "-translate-y-[150%]" : "translate-y-0"
        }`}
      >
        {renderContent()}
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${
          isAdded ? "translate-y-0" : "translate-y-[150%]"
        }`}
      >
        <Check className="w-5 h-5" />
        Added
      </div>
    </Button>
  );
};

export default AddToCart;
