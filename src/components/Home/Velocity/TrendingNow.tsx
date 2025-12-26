import { Button } from "@/components/ui/button";
import { getBentoGridProducts } from "@/utils/actions/actions";
import { formatPrice } from "@/utils/util";
import { ArrowRight, Star, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TrendingNow = async () => {
  const { accessory, featured, flashDeal, highestRated } =
    await getBentoGridProducts();

  const getDiscount = (base: string, sale: string | null) => {
    if (!sale) return 0;
    return Math.round(
      ((parseFloat(base) - parseFloat(sale)) / parseFloat(base)) * 100
    );
  };

  return (
    <section className="pt-12 pb-24 lg:pt-16 lg:pb-32 w-full px-4 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 lg:mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Trending Now
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Our editors' top picks, fresh arrivals, and limited-time offers.
            </p>
          </div>
          <Button
            variant="ghost"
            className="hidden md:flex gap-2 text-primary hover:text-primary-foreground hover:bg-primary"
          >
            <Link href="/products">View All Products</Link>
          </Button>
        </div>

        {/* THE BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-auto lg:h-[800px]">
          {/* CARD 1: Featured (New Arrival) */}
          {featured && (
            <Link
              href={`/products/${featured.id}`}
              className="
                group relative overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl
                col-span-1 md:col-span-2 lg:row-span-2
                h-[450px] lg:h-auto
              "
            >
              <Image
                src={featured.mainImagePath}
                alt={featured.name}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-extrabold tracking-widest text-primary-foreground bg-primary rounded-full">
                  NEW ARRIVAL
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight max-w-md">
                  {featured.name}
                </h3>
                <p className="text-gray-200 mb-4 line-clamp-2 max-w-sm text-sm lg:text-base">
                  Experience the pinnacle of performance with our latest
                  flagship.
                </p>
                <span className="text-white font-semibold flex items-center gap-2 group-hover:underline underline-offset-4 decoration-primary">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          )}

          {/* CARD 2: Staff Pick */}
          {highestRated && (
            <Link
              href={`/products/${highestRated.id}`}
              className="
                group relative overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl
                col-span-1 lg:row-span-2
                h-[450px] lg:h-auto
              "
            >
              <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-md text-foreground border border-border px-3 py-1 rounded-full text-xs font-extrabold tracking-wide flex items-center gap-2 shadow-sm">
                <Star className="w-3 h-3 fill-primary text-primary" />
                STAFF PICK
              </div>

              <div className="absolute inset-x-0 top-0 h-2/3 p-6 flex items-center justify-center bg-zinc-50 group-hover:bg-zinc-100 transition-colors">
                <div className="relative w-full h-full">
                  <Image
                    src={highestRated.mainImagePath}
                    alt={highestRated.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain transition-transform duration-500 group-hover:-translate-y-2 mix-blend-multiply"
                    unoptimized
                  />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-card flex flex-col justify-center p-6 border-t border-border">
                <h4 className="mb-1 line-clamp-2 text-foreground font-semibold text-lg">
                  {highestRated.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(highestRated.basePrice.toLocaleString())}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* CARD 3: Flash Deal */}
          {flashDeal && (
            <Link
              href={`/products/${flashDeal.id}`}
              className="
                group relative overflow-hidden bg-destructive/5 border border-destructive/20 hover:border-destructive/50 transition-all duration-300 rounded-xl
                col-span-1 lg:row-span-1
                h-hero-card-base lg:h-auto
              "
            >
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-destructive text-destructive-foreground text-xs font-extrabold tracking-wide px-2 py-1 rounded animate-pulse flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {getDiscount(flashDeal.basePrice, flashDeal.salePrice)}% OFF
                </div>
              </div>

              <div className="h-full p-6 flex flex-col justify-between">
                <div className="relative w-full h-32">
                  <Image
                    src={flashDeal.mainImagePath}
                    alt={flashDeal.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">
                    Flash Deal
                  </p>
                  <p className="font-bold truncate text-foreground">
                    {flashDeal.name}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* CARD 4: Accessory */}
          {accessory && (
            <Link
              href={`/products/${accessory.id}`}
              className="
                group relative overflow-hidden bg-secondary/30 border border-secondary hover:border-primary/30 transition-all duration-300 rounded-xl
                col-span-1 lg:row-span-1
                h-hero-card-base lg:h-auto
              "
            >
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-background text-secondary-foreground text-xs font-extrabold tracking-wide px-2 py-1 rounded border border-border">
                  ESSENTIALS
                </div>
              </div>

              <div className="h-full p-6 flex flex-col justify-between">
                <div className="relative w-full h-32">
                  <Image
                    src={accessory.mainImagePath}
                    alt={accessory.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain group-hover:rotate-12 transition-transform duration-500 mix-blend-multiply"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Starts at{" "}
                    {formatPrice(accessory.basePrice.toLocaleString())}
                  </p>
                  <p className="font-bold truncate text-foreground">
                    {accessory.name}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
