import HeroImage from "@/assets/Product-Hero.webp";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

const GeneralHero = () => {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src={HeroImage}
          alt="Product Page Hero Image"
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
      </div>
      {/* content */}
      <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto mt-16 mb-4">
        <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 md:backdrop-blur-md animate-in fade-in slide-in-from-left-4 duration-700">
          <span className="text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase">
            2025 Catalog
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9] animate-in fade-in slide-in-from-right-6 duration-700 delay-100">
          The <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
            Collection
          </span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
          Explore our curated selection of premium electronics. Performance,
          design, and innovation in every pixel.
        </p>
      </div>
      {/* SCROLL INDICATOR  */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50 mt-4">
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
};

export default GeneralHero;
