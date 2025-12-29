import HeroSkeleton from "@/components/product/Hero/HeroSkeleton";
import {
  FilterSkeleton,
  ProductListSkeleton,
} from "@/components/product/Skeletons";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background pb-12">
      {/* 1. Hero Section Skeleton */}
      <HeroSkeleton />

      {/* 2. Main Content Skeleton (Matches your page layout) */}
      <div className="max-w-7xl mx-auto pt-8 px-4 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <FilterSkeleton />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductListSkeleton />
        </div>
      </div>
    </main>
  );
}
