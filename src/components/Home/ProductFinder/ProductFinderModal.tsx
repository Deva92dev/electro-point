"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilteredProductsType } from "@/utils/types";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md animate-in fade-in duration-300">
      {/* header */}
      <div className="flex items-center justify-between p-6 border-b border-border/40">
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
      {/* Modal Scrollable content */}
    </div>
  );
};

export default ProductFinderModal;
