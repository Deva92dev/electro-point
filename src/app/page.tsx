import dynamic from "next/dynamic";
import HeroSkeleton from "@/components/Home/Hero/HeroSkeleton";
import PureHero from "@/components/Home/PureHero";
import { Suspense } from "react";
import {
  MarqueeSkeleton,
  SectionSkeleton,
  ServicesSkeleton,
} from "@/components/Home/Velocity/Skeletons";

const FeaturedCollections = dynamic(
  () => import("@/components/Home/Hero/Hero"),
  { loading: () => <HeroSkeleton /> }
);

const ProductFinder = dynamic(
  () => import("@/components/Home/ProductFinder/ProductFinder"),
  { loading: () => <SectionSkeleton /> }
);

const Marquee = dynamic(() => import("@/components/Home/Velocity/Marquee"), {
  loading: () => <MarqueeSkeleton />,
});

const TrendingNow = dynamic(
  () => import("@/components/Home/Velocity/TrendingNow"),
  { loading: () => <SectionSkeleton /> }
);

const ComparisonServer = dynamic(
  () => import("@/components/Home/Comparison/ComparisonServer"),
  { loading: () => <SectionSkeleton /> }
);

const Services = dynamic(() => import("@/components/Home/Services"), {
  loading: () => <ServicesSkeleton />,
});

export default async function Home() {
  return (
    <>
      <PureHero />
      <div className="mt-12 lg:mt-24">
        <FeaturedCollections />
      </div>
      <ProductFinder />
      <Suspense>
        <Marquee />
      </Suspense>
      <TrendingNow />
      <ComparisonServer />
      <Services />
    </>
  );
}
