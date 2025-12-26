import { Suspense } from "react";
import {
  FilterSkeleton,
  ProductListSkeleton,
} from "@/components/product/Skeletons";
import { FilterGate, ListingGate } from "@/components/product/DynamicWrapper";
import HeroSection from "@/components/product/Hero/HeroSection";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    maxPrice?: string;
    minPrice?: string;
    color?: string;
    productType: string;
    search?: string;
    brand?: string;
    category?: string;
  }>;
};

const ProductPage = async (props: PageProps) => {
  const searchParamsPromise = props.searchParams;

  return (
    <main className="min-h-screen bg-background pb-12">
      <Suspense
        fallback={<div className="h-[300px] w-full bg-muted animate-pulse" />}
      >
        <HeroSection paramsPromise={searchParamsPromise} />
      </Suspense>

      <div className="max-w-7xl mx-auto pt-8 px-4 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <Suspense fallback={<FilterSkeleton />}>
            <FilterGate paramsPromise={searchParamsPromise} />
          </Suspense>
        </aside>

        <div className="flex-1">
          <Suspense fallback={<ProductListSkeleton />}>
            <ListingGate paramsPromise={searchParamsPromise} />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
