"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  categories: { name: string; slug: string }[];
  brands: { name: string; slug: string }[];
  activeParams: {
    page?: string;
    sort?: string;
    maxPrice?: string;
    minPrice?: string;
    color?: string;
    productType?: string;
    search?: string;
    brand?: string;
    category?: string;
  };
}

const FilterSidebar = ({ categories, brands }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for price inputs to avoid stuttering URL updates
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("min"),
    max: searchParams.get("max"),
  });

  // url update
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      // Reset page to 1 whenever a filter changes
      if (name !== "page") {
        params.set("page", "1");
      }

      return params.toString();
    },
    [searchParams]
  );

  const applyFilter = (name: string, value: string | null) => {
    router.push(`?${createQueryString(name, value)}`, { scroll: false });
  };

  // Price Filter Logic
  const applyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (priceRange.min) params.set("minPrice", priceRange.min);
    else params.delete("minPrice");

    if (priceRange.max) params.set("maxPrice", priceRange.max);
    else params.delete("maxPrice");

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // active state checks
  const currentCategory = searchParams.get("category");
  const currentProductType = searchParams.get("productType");
  const currentBrand = searchParams.get("brand");
  const currentColor = searchParams.get("color");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {(currentBrand ||
          currentCategory ||
          currentColor ||
          currentProductType ||
          priceRange.min) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/products")}
            className="text-muted-foreground hover:text-destructive h-8 px-2"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* category */}
    </div>
  );
};

export default FilterSidebar;
