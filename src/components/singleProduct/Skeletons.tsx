export const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-background pt-20 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="aspect-square bg-muted/30 animate-pulse rounded-3xl" />
      <div className="space-y-6">
        <div className="h-12 w-3/4 bg-muted/30 animate-pulse rounded-lg" />
        <div className="h-6 w-1/4 bg-muted/30 animate-pulse rounded-lg" />
        <div className="h-40 w-full bg-muted/30 animate-pulse rounded-lg" />
      </div>
    </div>
  </div>
);
