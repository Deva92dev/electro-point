import { Button } from "@/components/ui/button";
import { getBentoGridProducts } from "@/utils/actions/actions";
import { formatPrice } from "@/utils/util";
import { ArrowRight, Star, Timer, Zap } from "lucide-react"; // Added Zap icon
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 lg:mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Trending Now
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
              Our editors' top picks, fresh arrivals, and limited-time offers
              selected just for you.
            </p>
          </div>
          <Button
            variant="ghost"
            asChild
            className="hidden md:flex gap-2 text-primary hover:text-primary-foreground hover:bg-primary"
          >
            <Link href="/products">View All Products</Link>
          </Button>
        </div>

        {/* THE BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-auto lg:h-[800px]">
          {/* CARD 1: Featured  */}
          {featured && (
            <Link
              href={`/products/${featured.id}`}
              className="
                group relative overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl
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
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 lg:p-10 space-y-4">
                <span className="inline-block px-3 py-1 text-xs font-extrabold tracking-widest text-primary-foreground bg-primary rounded-full shadow-md">
                  NEW ARRIVAL
                </span>
                <div className="space-y-2">
                  <h3 className="text-2xl lg:text-4xl font-bold text-white leading-tight max-w-md">
                    {featured.name}
                  </h3>
                  <p className="text-zinc-200 line-clamp-2 max-w-sm text-sm lg:text-base leading-relaxed">
                    Experience the pinnacle of performance with our latest
                    flagship device.
                  </p>
                </div>
                <span className="text-white font-semibold flex items-center gap-2 group-hover:underline underline-offset-4 decoration-primary pt-2">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </Link>
          )}

          {/* CARD 2: Staff Pick */}
          {highestRated && (
            <Link
              href={`/products/${highestRated.id}`}
              className="
                group relative overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl
                col-span-1 lg:row-span-2
                h-[450px] lg:h-auto flex flex-col
              "
            >
              <div className="absolute top-5 left-5 z-10 bg-background/90 backdrop-blur-md text-foreground border border-border px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wide flex items-center gap-2 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                STAFF PICK
              </div>

              <div className="relative flex-1 p-8 flex items-center justify-center bg-muted/30 group-hover:bg-muted/50 transition-colors">
                <div className="relative w-full h-full max-h-[300px]">
                  <Image
                    src={highestRated.mainImagePath}
                    alt={highestRated.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain transition-transform duration-500 group-hover:-translate-y-2 mix-blend-multiply dark:mix-blend-normal"
                    unoptimized
                  />
                </div>
              </div>

              <div className="p-6 lg:p-8 border-t border-border bg-card space-y-3">
                <h4 className="line-clamp-2 text-foreground font-bold text-lg leading-snug">
                  {highestRated.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(highestRated.basePrice.toLocaleString())}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* CARD 3 */}
          {flashDeal && (
            <Link
              href={`/products/${flashDeal.id}`}
              className="
                group relative overflow-hidden bg-card border border-destructive/20 hover:border-destructive/40 transition-all duration-300 rounded-2xl
                col-span-1 lg:row-span-1
                h-hero-card-base lg:h-auto flex flex-col
              "
            >
              <div className="absolute top-5 right-5 z-10">
                <div className="bg-red-700 text-white text-xs font-extrabold tracking-wide px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                  <Timer className="w-3.5 h-3.5" />
                  {getDiscount(flashDeal.basePrice, flashDeal.salePrice)}% OFF
                </div>
              </div>

              <div className="relative flex-1 p-6 lg:p-8 flex items-center justify-center bg-destructive/5 group-hover:bg-destructive/10 transition-colors">
                <div className="relative w-full h-32 lg:h-40">
                  <Image
                    src={flashDeal.mainImagePath}
                    alt={flashDeal.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                    unoptimized
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border/50 bg-card space-y-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-4 h-4 text-red-700 fill-red-700 dark:text-red-500 dark:fill-red-500" />
                  <p className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Flash Deal
                  </p>
                </div>
                <p className="font-bold truncate text-foreground text-lg">
                  {flashDeal.name}
                </p>
              </div>
            </Link>
          )}

          {/* CARD 4: Accessory */}
          {accessory && (
            <Link
              href={`/products/${accessory.id}`}
              className="
                group relative overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 rounded-2xl
                col-span-1 lg:row-span-1
                h-hero-card-base lg:h-auto flex flex-col
              "
            >
              <div className="absolute top-5 left-5 z-10">
                <div className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-extrabold tracking-wide px-2.5 py-1 rounded-md border border-border shadow-sm">
                  ESSENTIALS
                </div>
              </div>

              <div className="relative flex-1 p-6 lg:p-8 flex items-center justify-center bg-muted/40 group-hover:bg-muted/60 transition-colors">
                <div className="relative w-full h-32 lg:h-40">
                  <Image
                    src={accessory.mainImagePath}
                    alt={accessory.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain group-hover:rotate-6 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                    unoptimized
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border/50 bg-card space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Starts at{" "}
                  <span className="text-foreground font-bold">
                    {formatPrice(accessory.basePrice.toLocaleString())}
                  </span>
                </p>
                <p className="font-bold truncate text-foreground text-lg">
                  {accessory.name}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
