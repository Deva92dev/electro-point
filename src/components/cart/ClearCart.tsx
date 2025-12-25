"use client";

import { useCartStore } from "@/store/cart-store";
import { useEffect } from "react";

export const ClearCart = () => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
};
