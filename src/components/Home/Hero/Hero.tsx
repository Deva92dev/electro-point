import { getCategoriesWithImages } from "@/lib/data";
import HeroScrollEffect from "./HeroScrollEffect";

const Hero = async () => {
  const categoryResults = await getCategoriesWithImages();
  // console.log(categoryResults);

  if (categoryResults.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-gradient-to-b from-muted to-background">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Welcome to Electro Point
          </h1>
          <p className="text-xl text-muted-foreground">
            Premium Electronics Collection
          </p>
        </div>
      </div>
    );
  }

  return <HeroScrollEffect results={categoryResults} />;
};

export default Hero;
