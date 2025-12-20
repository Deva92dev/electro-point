"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist-store";

// This component renders nothing. It just syncs data.
const WishlistSync = ({ wishlistIds }: { wishlistIds: number[] }) => {
  const setWishlist = useWishlistStore((state) => state.setWishlist);

  useEffect(() => {
    // Whenever the server passes new IDs (e.g. on page load), sync the store.
    setWishlist(wishlistIds);
  }, [wishlistIds, setWishlist]);

  return null;
};

export default WishlistSync;
