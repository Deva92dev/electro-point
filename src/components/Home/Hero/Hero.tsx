import HeroScrollEffect from "./HeroScrollEffect";
import { getHeroImages } from "@/utils/actions/actions";
import { ArrowRight } from "lucide-react";

const FeaturedCollections = async () => {
  const categoryResults = await getHeroImages();

  return (
    <section className="relative w-full pb-12 md:pb-24 overflow-hidden bg-background">
      <div className="w-full">
        <div className="container mx-auto px-4 md:px-8 mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              Curated Collections
            </h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-md">
              Explore our 2025 lineup designed for the modern creator.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground animate-pulse">
            <span>Scroll to explore</span>
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-muted/50">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
        <HeroScrollEffect results={categoryResults} />
      </div>
    </section>
  );
};

export default FeaturedCollections;
