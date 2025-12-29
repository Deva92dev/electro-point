import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="group relative bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col">
      {/* Image Area */}
      <div className="aspect-4/3 w-full bg-muted relative p-4">
        <Skeleton className="h-full w-full rounded-lg bg-background/50" />
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Brand/Category Tag */}
        <Skeleton className="h-3 w-20 rounded-full" />

        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <Skeleton className="h-6 w-24" /> {/* Price */}
          <Skeleton className="h-4 w-12" /> {/* Rating */}
        </div>
      </div>
    </div>
  );
}

// --- PRODUCT LIST GRID SKELETON ---
export function ProductListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Bar (Sort/Count) */}
      <div className="flex justify-between items-center h-10">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-40 rounded-md" />
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// --- FILTER SIDEBAR SKELETON ---
export function FilterSkeleton() {
  return (
    <div className="space-y-8 pr-4">
      {/* Search Bar Skeleton */}
      <Skeleton className="h-10 w-full rounded-md mb-6" />

      {/* Filter Sections (Mimics Accordions) */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          {/* Filter Header */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24 font-bold" />
            <Skeleton className="h-4 w-4" />
          </div>

          {/* Filter Options (Checkboxes) */}
          <div className="space-y-2 pl-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="h-px w-full bg-border mt-4" />
        </div>
      ))}
    </div>
  );
}
