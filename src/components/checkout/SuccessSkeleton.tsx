export const SuccessSkeleton = () => (
  <div className="min-h-screen pt-24 pb-20 bg-muted/30 flex items-center justify-center">
    <div className="bg-background border border-border rounded-2xl shadow-sm p-12 text-center w-full max-w-lg">
      <div className="w-20 h-20 bg-muted/30 rounded-full mx-auto mb-6 animate-pulse" />
      <div className="h-8 w-3/4 bg-muted/30 mx-auto mb-4 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-muted/30 mx-auto mb-8 rounded animate-pulse" />
      <div className="h-40 bg-muted/20 rounded-xl mb-8 animate-pulse" />
    </div>
  </div>
);
