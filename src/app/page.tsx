import ComparisonServer from "@/components/Home/Comparison/ComparisonServer";
import Hero from "@/components/Home/Hero/Hero";
import HeroSkeleton from "@/components/Home/Hero/HeroSkeleton";
import ProductFinder from "@/components/Home/ProductFinder/ProductFinder";
import Services from "@/components/Home/Services";
import Marquee from "@/components/Home/Velocity/Marquee";
import TrendingNow from "@/components/Home/Velocity/TrendingNow";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <ProductFinder />
      <Marquee />
      <TrendingNow />
      <ComparisonServer />
      <Services />
    </>
  );
}
