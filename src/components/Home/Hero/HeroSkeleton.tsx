const HeroSkeleton = () => {
  return (
    <section className="w-full overflow-x-hidden">
      <div className="p-4 flex flex-row gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="relative w-hero-card-2xl h-hero-card-lg bg-background">
              <div className="object-cover w-full h-full rounded-xl bg-muted animate-pulse" />
              <h3 className="absolute bottom-12 text-white capitalize backdrop-blur-md transition-opacity duration-200 p-4 bg-black/50 rounded-4xl left-12"></h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSkeleton;
