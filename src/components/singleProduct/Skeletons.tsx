import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* LEFT COLUMN: Image Gallery Skeleton */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative rounded-2xl overflow-hidden border border-border/50 bg-muted/20">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Product Info Skeleton */}
        <div className="flex flex-col space-y-6">
          {/* Badge & Title */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />{" "}
            {/* New Arrival Badge */}
            <Skeleton className="h-10 w-3/4" /> {/* Product Name */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-32" /> {/* Rating */}
              <Skeleton className="h-5 w-20" /> {/* Reviews count */}
            </div>
          </div>

          {/* Price */}
          <div className="py-4 border-y border-border/50 space-y-2">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>

          {/* Description (Short) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Variants (Colors) */}
          <div className="space-y-3 pt-4">
            <Skeleton className="h-5 w-16" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <Skeleton className="h-12 w-full rounded-xl" /> {/* Add to Cart */}
            <Skeleton className="h-12 w-full rounded-xl" /> {/* Wishlist */}
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border rounded-xl space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
