"use client";

import { useCartStore } from "@/store/cart-store";
import { useEffect, useState, useMemo, useRef } from "react";
import { AnimatePresence, m } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  RefreshCw,
  Eraser,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  validateCart,
  updateCartItemQuantity,
  clearCartServer,
} from "@/utils/actions/mutations";
import SearchInput from "./SearchInput";
import { formatPrice } from "@/utils/util";
import { toast } from "sonner";

const CartSheet = () => {
  const {
    isOpen,
    toggleCart,
    items,
    removeItem,
    updateQuantity,
    getCartTotal,
    syncWithServer,
    isSynced,
    clearCart,
  } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Ref to hold debounce timers for each product
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    setIsMounted(true);
    // Only validate on OPEN, not on every change
    if (isOpen && items.length > 0 && !isSynced) {
      handleValidate();
    }
  }, [isOpen]);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const freshItems = await validateCart(items);
      syncWithServer(freshItems);
    } catch (err) {
      console.error("Cart sync failed", err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = async () => {
    if (confirm("Are you sure you want to remove all items?")) {
      setIsClearing(true);
      try {
        // Try to clear server first
        await clearCartServer();
      } catch (error) {
        console.error("Failed to clear server cart", error);
      } finally {
        // Always clear local client
        clearCart();
        setIsClearing(false);
        toast.success("Cart cleared");
      }
    }
  };

  const handleQuantityChange = (
    productId: number,
    variantId: number | undefined,
    newQty: number
  ) => {
    // Instant UI Update (Optimistic)
    updateQuantity(productId, variantId, newQty);

    // Create a unique key for this item
    const itemKey = `${productId}-${variantId || "base"}`;

    //  Clear existing timer if user is spamming clicks
    if (debounceTimers.current[itemKey]) {
      clearTimeout(debounceTimers.current[itemKey]);
    }

    debounceTimers.current[itemKey] = setTimeout(async () => {
      await updateCartItemQuantity(productId, variantId, newQty);
      delete debounceTimers.current[itemKey];
    }, 500);
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const lowerQuery = searchQuery.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(lowerQuery));
  }, [items, searchQuery]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleCart}
          className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md"
        >
          <m.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 z-101 h-full w-full max-w-lg border-l border-border bg-background shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-border p-6 bg-muted/5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Your Cart
                  <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </h2>
                <div className="flex gap-2">
                  {/* Clear Cart Button */}
                  {items.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClear}
                      disabled={isClearing}
                      title="Clear Cart"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Eraser className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleValidate}
                    disabled={isValidating}
                    title="Refresh Prices & Stock"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isValidating ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCart}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {items.length > 0 && (
                <SearchInput
                  onSearch={setSearchQuery}
                  placeholder="Find in cart..."
                  className="w-full"
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 opacity-50" />
                  </div>
                  <p className="text-lg font-medium">Your cart is Empty</p>
                  <Button variant="outline" onClick={toggleCart}>
                    Continue Shopping
                  </Button>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <p>No items found matching "{searchQuery}"</p>
                  <Button variant="link" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                filteredItems.map((i) => {
                  const threshold = i.lowStockThreshold ?? 5;
                  const isLowStock = i.maxStock > 0 && i.maxStock <= threshold;
                  const isOutOfStock = i.maxStock === 0;

                  return (
                    <div
                      key={`${i.productId}-${i.variantId}`}
                      className={`flex gap-4 group relative ${
                        isOutOfStock ? "opacity-50 grayscale" : ""
                      }`}
                    >
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white border border-border shrink-0">
                        {i.image ? (
                          <Image
                            src={i.image}
                            alt={i.name}
                            fill
                            className="object-contain p-2"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-sm line-clamp-2 leading-tight pr-4">
                              {i.name}
                            </h3>
                            <button
                              onClick={() =>
                                removeItem(i.productId, i.variantId)
                              }
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {i.color && (
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                              Variant:{" "}
                              <span className="text-foreground">{i.color}</span>
                            </p>
                          )}

                          {/* Stock Warnings */}
                          {isOutOfStock && (
                            <p className="text-[10px] text-destructive font-bold mt-1">
                              Out of Stock
                            </p>
                          )}
                          {!isOutOfStock && isLowStock && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded w-fit">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Hurry! Only {i.maxStock} left
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 border border-border rounded-lg p-1 h-9 bg-background">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  i.productId,
                                  i.variantId,
                                  i.quantity - 1
                                )
                              }
                              className="w-8 h-full flex items-center justify-center text-muted-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-30"
                              disabled={i.quantity <= 1 || isOutOfStock}
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <span className="w-8 text-center font-mono text-sm font-bold">
                              {i.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  i.productId,
                                  i.variantId,
                                  i.quantity + 1
                                )
                              }
                              className="w-8 h-full flex items-center justify-center text-muted-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              disabled={i.quantity >= i.maxStock}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="font-bold text-sm">
                            {formatPrice(i.price * i.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4 bg-muted/10">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="block w-full"
                >
                  <Button
                    size="lg"
                    className="w-full font-bold text-base h-12 shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    Checkout Now
                  </Button>
                </Link>
              </div>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default CartSheet;
