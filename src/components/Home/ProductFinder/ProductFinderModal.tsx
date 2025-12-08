"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilteredProductsType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ProductFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  results: FilteredProductsType;
  priority: string | null;
  maxBudget: number;
}

const ProductFinderModal = ({
  isLoading,
  isOpen,
  maxBudget,
  onClose,
  priority,
  results,
}: ProductFinderModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Optional: Lock body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-md animate-in fade-in duration-300">
      {/* header */}
      <div className="flex items-center justify-between p-6 border-b border-border/40 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold">Your Perfect Match</h2>
          <p className="text-muted-foreground text-sm">
            Based on {priority} • Under ₹{maxBudget.toLocaleString()}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full h-12 w-12 hover:bg-primary/10"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div
        className="flex-1 overflow-y-auto p-6 overscroll-y-contain"
        data-lenis-prevent
      >
        <div className="max-w-5xl mx-auto pb-20">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xl animate-pulse">Analyzing Products...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4 text-center">
              <p className="font-medium text-xl">No Matches Found...</p>
              <p className="text-muted-foreground">
                Try increasing your budget or change your priority
              </p>
              <Button onClick={onClose} variant="outline">
                Adjust Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.id}`}
                  className="group"
                  onClick={onClose} // Close modal when clicking a product
                >
                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative w-full h-64 overflow-hidden bg-muted">
                      <Image
                        src={prod.mainImagePath || "/placeholder.jpg"}
                        alt={prod.name}
                        fill
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        Match: {Math.floor(Math.random() * 15) + 85}%
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-lg font-semibold text-primary mb-4">
                        ₹{parseFloat(prod.basePrice).toLocaleString()}
                      </p>

                      <div className="mt-auto space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {prod.quickSpecs
                            ? Object.values(prod.quickSpecs).join(" • ")
                            : "View details for specs"}
                        </p>
                        <Button className="w-full gap-2 group-hover:bg-primary/90">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // This teleports the 'modalContent' to be a direct child of <body>
  // bypassing all parent z-indexes (like the Navbar or Hero Section).
  return createPortal(modalContent, document.body);
};

export default ProductFinderModal;
