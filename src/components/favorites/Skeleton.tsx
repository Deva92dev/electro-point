export const FavoritesSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 lg:px-8 animate-pulse">
    <div className="flex flex-col gap-2 mb-10">
      <div className="h-10 w-48 bg-muted/40 rounded-md" />
      <div className="h-5 w-32 bg-muted/40 rounded-md" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="aspect-3/4 bg-muted/40 rounded-2xl" />
      ))}
    </div>
  </div>
);
