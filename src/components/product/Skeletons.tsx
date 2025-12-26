export const FilterSkeleton = () => (
  <div className="h-screen max-h-[800px] w-full bg-muted/30 animate-pulse rounded-xl" />
);

export const ProductListSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="h-10 w-48 bg-muted/40 animate-pulse rounded-md" />
      <div className="h-10 w-32 bg-muted/40 animate-pulse rounded-md" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="aspect-3/4 bg-muted/30 animate-pulse rounded-xl"
        />
      ))}
    </div>
  </div>
);
