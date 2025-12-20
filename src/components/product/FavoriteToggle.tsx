"use client";

import { toggleWishlistAction } from "@/utils/actions/mutations";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";

interface Props {
  productId: number;
  initialIsFavorite: boolean;
  className?: string;
}

const FavoriteToggle = ({ initialIsFavorite, productId, className }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // <--- 1. Get current path

  const isFavorite = useWishlistStore((state) =>
    state.wishlistIds.includes(productId)
  );
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    // Update UI instantly
    if (isFavorite) {
      removeItem(productId);
    } else {
      addItem(productId);
    }

    try {
      //
      const result = await toggleWishlistAction(productId, pathname);

      // Handle Auth Failure
      if (!result.success) {
        if (result.error === "Unauthorized") {
          // Revert optimistic update
          if (isFavorite) addItem(productId);
          else removeItem(productId);

          toast.error("Please login to save favorites");
          router.push("/login");
        } else {
          throw new Error(result.error);
        }
      }

      router.refresh();
    } catch (error) {
      // Revert optimistic update on error
      if (isFavorite) addItem(productId);
      else removeItem(productId);

      console.error("Failed to toggle wishlist", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "rounded-full shadow-sm hover:scale-110 transition-all duration-200 cursor-pointer z-10",
        isFavorite
          ? "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
          : "bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-red-500",
        className
      )}
      disabled={isLoading}
    >
      <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
      <span className="sr-only">Toggle Wishlist</span>
    </Button>
  );
};

export default FavoriteToggle;
