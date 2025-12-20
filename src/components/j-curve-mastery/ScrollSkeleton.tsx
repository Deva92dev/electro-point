const HeroScrollSkeleton = () => {
  return (
    <div className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-linear-to-b from-background via-card to-background">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-chart-2/20 rounded-full blur-3xl" />
        </div>
        <div className="relative h-full flex flex-col justify-center">
          <div className="text-center px-4 mb-8 md:mb-12">
            <div className="h-12 md:h-20 w-64 md:w-96 mx-auto bg-muted rounded-lg mb-4 animate-pulse" />
            <div className="h-6 md:h-8 w-48 md:w-64 mx-auto bg-muted/80 rounded-lg mb-6 animate-pulse" />
            <div className="h-4 w-32 mx-auto bg-muted/60 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-6 md:gap-8 px-4 md:px-8 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="relative shrink-0 w-hero-card-md md:w-[380px] h-[380px] md:h-[500px] rounded-4xl overflow-hidden bg-muted border border-border"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <div className="h-6 w-24 bg-background/80 rounded-full animate-pulse" />
                  <div className="h-6 w-full bg-background/70 rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-background/60 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-48 h-1 bg-muted/50 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default HeroScrollSkeleton;
