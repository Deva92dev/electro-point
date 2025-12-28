import dynamic from "next/dynamic";
import HeroSkeleton from "@/components/Home/Hero/HeroSkeleton";
import PureHero from "@/components/Home/PureHero";
import { Suspense } from "react";
import {
  MarqueeSkeleton,
  SectionSkeleton,
  ServicesSkeleton,
} from "@/components/Home/Velocity/Skeletons";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "ElectroPoint - Premium Electronics Store & Tech Accessories",
  description:
    "Discover the latest laptops, smartwatches, and accessories at ElectroPoint. Curated tech for modern creators with flash deals and premium support.",
  keywords: [
    "electronics",
    "online tech store",
    "gaming laptops",
    "smartphones",
    "wireless headphones",
    "tech accessories",
    "ElectroPoint",
    "premium gadgets",
    "buy electronics online",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ElectroPoint - Premium Electronics Store & Tech Accessories",
    description:
      "Upgrade your workflow with curated tech. Flash deals on top-tier laptops, phones, and gear. Shop ElectroPoint today.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectroPoint - Premium Electronics Store & Tech Accessories",
    description:
      "Upgrade your workflow with curated tech. Flash deals on top-tier laptops, phones, and gear. Shop ElectroPoint today.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  return (
    <main>
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
    </main>
  );
}
