export const HeroSkeleton = () => {
  return (
    <section className="relative w-full h-[75vh] min-h-[600px] bg-black overflow-hidden animate-pulse flex items-center">
      <div className="absolute inset-0 bg-zinc-900/50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-zinc-800/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        <div className="space-y-8 pt-12 lg:pt-0 order-2 lg:order-1 flex flex-col items-center lg:items-start">
          <div className="h-8 w-32 bg-zinc-800 rounded-full"></div>
          <div className="space-y-4 w-full flex flex-col items-center lg:items-start">
            <div className="h-16 md:h-20 w-4/5 max-w-md bg-zinc-800 rounded-xl"></div>
            <div className="h-16 md:h-20 w-3/5 max-w-sm bg-zinc-800 rounded-xl"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center w-full mt-2">
            <div className="h-14 w-52 bg-zinc-800 rounded-full"></div>
            <div className="h-6 w-32 bg-zinc-800/50 rounded hidden sm:block animate-pulse delay-75"></div>
          </div>
        </div>

        <div className="w-full flex justify-center order-1 lg:order-2">
          <div className="relative w-full max-w-[450px] aspect-4/5 bg-zinc-800/40 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-zinc-800/0 via-zinc-800/0 to-zinc-700/20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
