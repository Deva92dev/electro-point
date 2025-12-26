export const MarqueeSkeleton = () => (
  <div className="w-full py-8 overflow-hidden bg-background/80 border-y border-border relative z-10 opacity-50">
    <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-background to-transparent z-20" />
    <div className="flex flex-col gap-6">
      <div className="flex gap-8 pl-4 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={`s1-${i}`}
            className="h-10 w-40 shrink-0 rounded-full border border-border bg-muted/40 animate-pulse"
          />
        ))}
      </div>
      <div className="flex gap-8 pl-24 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={`s2-${i}`}
            className="h-10 w-40 shrink-0 rounded-full border border-border bg-muted/40 animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);

export const SectionSkeleton = () => (
  <div className="w-full h-[600px] py-24 flex items-center justify-center bg-muted/5 border-y border-transparent">
    <div className="flex flex-col items-center gap-4 opacity-50">
      <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
        Loading...
      </p>
    </div>
  </div>
);

export const ServicesSkeleton = () => (
  <div className="h-40 w-full bg-muted/10 animate-pulse" />
);
