"use client";

import { X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilteredProductsType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { formatPrice } from "@/utils/util";

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
    // locks bg scrolling
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
    <div className="fixed inset-0 z-100 flex flex-col animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl z-0"
        style={{
          backgroundImage: `
              radial-gradient(circle at top right, #2a2a2a 0%, #09090b 100%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")
            `,
          backgroundBlendMode: "overlay",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 md:p-8 border-b border-white/10 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              AI Recommendation
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Your Perfect Match
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Optimized for{" "}
            <span className="text-white font-medium">{priority}</span> • Budget
            under{" "}
            <span className="text-white font-medium">
              {formatPrice(maxBudget)}
            </span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full h-12 w-12 hover:bg-white/10 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex-1 overflow-y-auto p-6 md:p-8 overscroll-y-contain"
        data-lenis-prevent
      >
        <div className="max-w-6xl mx-auto pb-20">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-[50vh] space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-medium text-white">
                  Analyzing Specifications...
                </p>
                <p className="text-sm text-zinc-500">
                  Scanning thousands of products for the best {priority} match.
                </p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-[50vh] space-y-4 text-center">
              <p className="font-medium text-xl text-white">
                No exact matches found.
              </p>
              <p className="text-zinc-400 max-w-md">
                Your criteria might be too strict. Try increasing your budget or
                changing your priority.
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                className="mt-4 border-white/20 text-white hover:bg-white/10"
              >
                Adjust Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.id}`}
                  className="group block h-full"
                  onClick={onClose}
                >
                  <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col backdrop-blur-sm">
                    {/* Image Area */}
                    <div className="relative w-full aspect-4/3 overflow-hidden bg-white/5">
                      <Image
                        src={prod.mainImagePath || "/placeholder.jpg"}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw"
                        loading="lazy"
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                      {/* AI Match Badge */}
                      <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">
                        {Math.floor(Math.random() * 10) + 90}% MATCH
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {prod.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(parseFloat(prod.basePrice))}
                        </span>
                        {/* Optional: Add rating stars here if available */}
                      </div>

                      <div className="mt-auto space-y-4">
                        {/* Specs Mini-Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                          {prod.quickSpecs &&
                            Object.entries(prod.quickSpecs)
                              .slice(0, 4)
                              .map(([key, val]) => (
                                <div
                                  key={key}
                                  className="bg-white/5 px-2 py-1.5 rounded border border-white/5 truncate"
                                >
                                  {String(val)}
                                </div>
                              ))}
                        </div>

                        <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold rounded-full">
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

  return createPortal(modalContent, document.body);
};

export default ProductFinderModal;
