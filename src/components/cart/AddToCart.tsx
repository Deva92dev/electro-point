"use client";

import { CartItem, useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ShoppingCart, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { addToCartServer } from "@/utils/actions/mutations";

interface Props {
  product: {
    id: number;
    name: string;
    basePrice: string;
    salePrice: string | null;
    stock?: number;
    lowStockThreshold?: number;
  };
  selectedVariant?: {
    id?: number;
    color?: string;
    image?: string;
    stock?: number;
    lowStockThreshold?: number;
  };
  currentImage: string;
  className?: string;
  children?: React.ReactNode;
  isAuthenticated: boolean;
}

const AddToCart = ({
  product,
  currentImage,
  selectedVariant,
  className,
  children,
  isAuthenticated,
}: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const effectiveStock = selectedVariant?.stock ?? product.stock ?? 5;
  const effectiveThreshold =
    selectedVariant?.lowStockThreshold ?? product.lowStockThreshold ?? 5;
  const isOutOfStock = effectiveStock === 0;

  const handleAddProduct = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart");
      router.push(`/login?callbackUrl=${pathname}`);
      return;
    }

    if (isOutOfStock || isLoading) return;
    setIsLoading(true);

    const price = product.salePrice
      ? Number(product.salePrice)
      : Number(product.basePrice);

    const finalImage = selectedVariant?.image || currentImage || "";

    const itemToAdd: CartItem = {
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: price,
      image: finalImage,
      color: selectedVariant?.color || "Default",
      quantity: 1,
      maxStock: effectiveStock,
      lowStockThreshold: effectiveThreshold,
    };

    // 1. Optimistic Update (Show it immediately)
    addItem(itemToAdd);

    try {
      console.log("📤 Sending to server:", {
        productId: product.id,
        variantId: selectedVariant?.id,
      });

      //  CALL SERVER
      const result = await addToCartServer(product.id, selectedVariant?.id, 1);

      // CHECK RESULT
      if (result && result.success) {
        setIsAdded(true);
        toast.success("Added to cart");
      } else {
        throw new Error(result?.message || "Server returned false");
      }
    } catch (err: any) {
      toast.error(`Sync failed: ${err.message}`);
      // Optional: Remove the item from store if it failed?
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isAdded) {
      timeout = setTimeout(() => setIsAdded(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [isAdded]);

  const renderContent = () => {
    if (isLoading) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (children) return children;
    if (pathname === "/products")
      return <ShoppingCart className="w-5 h-5 cursor-pointer" />;
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
      disabled={isOutOfStock || isAdded || isLoading}
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
