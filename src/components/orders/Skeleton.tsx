export const OrdersSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border border-border rounded-xl overflow-hidden">
        <div className="bg-muted/40 h-16 w-full border-b border-border" />
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-muted/40 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-1/3 bg-muted/40 rounded" />
              <div className="h-4 w-1/4 bg-muted/40 rounded" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
