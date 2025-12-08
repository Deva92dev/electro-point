import { getHeroCard } from "@/lib/imagekit-loader";
import { CategoryHeroItemType } from "./HeroScrollEffect";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const HeroCard = ({
  item,
  index,
}: {
  item: CategoryHeroItemType;
  index: number;
}) => {
  const imageUrl = item.imageUrl
    ? getHeroCard(item.imageUrl)
    : "/placeholder.jpg";

  // this directly filters on products page
  const href = `/products?category=${item.productType}`;

  return (
    <Link href={href} key={item.id} className="group relative block">
      <div className="relative w-hero-card-md h-[400px] md:w-hero-card-2xl md:h-hero-card-lg rounded-4xl overflow-hidden bg-muted border border-white/10 shadow-sm transition-shadow duration-500 hover:shadow-2xl">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          preload={index === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
        {/* 5. CONTENT OVERLAY */}
        <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col  justify-end h-full">
          {/* Top Label */}
          <div className="mb-auto opacity-0 -translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70 border border-white/20 px-2 py-1 rounded-full">
              0{index + 1}
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-2">
                {item.productType}
              </h3>
              <p className="text-sm text-white/60 font-medium opacity-0 h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:h-auto">
                Browse Collection
              </p>
            </div>
            {/* The Rotating Arrow Button */}
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:rotate-45">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HeroCard;
