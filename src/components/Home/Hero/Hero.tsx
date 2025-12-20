import HeroScrollEffect from "./HeroScrollEffect";
import { getHeroImages } from "@/utils/actions/actions";

const Hero = async () => {
  const categoryResults = await getHeroImages();

  return (
    <section className="w-full pt-8 pb-12 md:pt-12 md:pb-24 overflow-hidden">
      <div className="w-full pl-4 md:pl-8 lg:pl-12">
        <div className="flex items-end justify-between pr-4 md:pr-12 mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            Future <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-600">
              Ready.
            </span>
          </h1>
          <p className="hidden md:block text-muted-foreground max-w-xs text-sm font-medium text-right">
            Explore the 2025 collection. <br />
            Curated for the modern creator.
          </p>
        </div>
        <HeroScrollEffect results={categoryResults} />
      </div>
    </section>
  );
};

export default Hero;
