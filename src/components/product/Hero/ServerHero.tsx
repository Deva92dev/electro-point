import { Button } from "@/components/ui/button";
import { getCategoryChampion } from "@/utils/actions/actions";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import TitanInteraction from "./TitanInteraction";
import { formatPrice } from "@/utils/util";

interface Props {
  categorySlug: string;
}

const ServerHero = async ({ categorySlug }: Props) => {
  const champion = await getCategoryChampion(categorySlug);
  if (!champion) return [];

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] max-h-[900px] bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden select-none pointer-events-none">
        <h1
          className="text-[18vw] font-black leading-none text-transparent uppercase whitespace-nowrap opacity-[0.08]"
          style={{
            WebkitTextStroke: "2px rgba(255, 255, 255, 0.5)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {champion.categoryName}
        </h1>
      </div>
      {/* ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center, transparent_0%, #000000_100%)] z-0 pointer-events-none" />
      <div className="absolute top-0 left1/2 -translate-1/2 w-full h-full bg-linear-to-b from-indigo-900/20 via-transparent to-black z-0 pointer-events-none" />
      {/* content grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        {/* Left Product Info */}
        <div className="space-y-8 text-center lg:text-left pt-20 lg:pt-0 order-2 lg:order-1">
          <div className="inline-block px-4 py-1.5 rounded-full  border border-white/20 bg-white/5 backdrop-blur-md">
            <span className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase">
              Category Titan
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[0.9]">
            {champion.categoryName} <br />
            <span className="text-zinc-500">Collection.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
            <Link href={champion.shopLink}>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 h-14 font-bold text-base transition-transform hover:scale-105"
              >
                Shop Flagship <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            {champion.price && (
              <span className="text-white/60 font-mono text-sm">
                Starting at {formatPrice(Number(champion.price))}
              </span>
            )}
          </div>
        </div>
        {/* Right: Interactive 3D Image */}
        <div className="w-full flex justify-center lg:justify-end order-1 lg:order-2">
          <TitanInteraction
            src={champion.titanImage}
            alt={champion.categoryName}
          />
        </div>
      </div>
    </section>
  );
};

export default ServerHero;
