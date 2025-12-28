"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
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
  const currentBrand = searchParams.get("brand");
  const currentColor = searchParams.get("color");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Filters</h2>
        {(currentBrand ||
          currentCategory ||
          currentColor ||
          priceRange.min) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/products")}
            className="text-muted-foreground hover:text-destructive h-8 px-2 cursor-pointer"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* category */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                applyFilter(
                  "category",
                  currentCategory === cat.slug ? null : cat.slug
                )
              }
              className={`block text-sm text-left transition-colors cursor-pointer ${
                currentCategory === cat.slug
                  ? "font-bold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      {/* price range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Price Range
        </h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={priceRange.min || ""}
            placeholder="Min"
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
            className="h-9"
          />
          <Input
            type="number"
            value={priceRange.max || ""}
            placeholder="Max"
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            className="h-9"
          />
        </div>
        <Button
          onClick={applyPrice}
          variant="secondary"
          size="sm"
          className="w-full cursor-pointer"
        >
          Apply Price
        </Button>
      </div>
      {/* brands */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Brands
        </h4>
        <div className="space-y-2">
          {brands.map((b) => (
            <div key={b.slug} className="flex items-center gap-2">
              <button
                onClick={() =>
                  applyFilter("brand", currentBrand === b.slug ? null : b.slug)
                }
                className={`text-sm cursor-pointer ${
                  currentBrand === b.slug
                    ? "font-bold text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {b.name}
              </button>
              {currentBrand === b.slug && (
                <X
                  className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-destructive"
                  onClick={() => applyFilter("brand", null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* colors */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Colors
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            "Black",
            "White",
            "Silver",
            "Grey",
            "Red",
            "Blue",
            "Green",
            "Gold",
          ].map((c) => (
            <button
              key={c}
              onClick={() =>
                applyFilter("color", currentColor === c ? null : c)
              }
              className={`w-6 h-6 rounded-full border border-border shadow-sm transition-transform ${
                currentColor === c
                  ? "ring-2 ring-primary ring-offset-2 scale-110"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: c.toLowerCase() }}
              title={c}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
