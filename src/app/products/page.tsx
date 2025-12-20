import { Suspense } from "react";
import { headers } from "next/headers";
import FilterSidebar from "@/components/product/filter/FilterSidebar";
import SortDropDown from "@/components/product/filter/SortDropDown";
import GeneralHero from "@/components/product/Hero/GeneralHero";
import ServerHero from "@/components/product/Hero/ServerHero";
import PaginationControl from "@/components/product/Pagination/PaginationControl";
import ProductsGrid from "@/components/product/ProductCard/ProductsGrid";
import { getAllProducts, getFilterOptions } from "@/utils/actions/actions";
import { auth } from "@/lib/auth";
import { getUserWishlistIds } from "@/utils/actions/mutations";
import WishlistSync from "@/components/global/WishlistSync";

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
  const params = await props.searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAuthenticated = !!session?.user;
  const userId = session?.user.id as string;

  const [data, filterOptions, wishlistIds] = await Promise.all([
    getAllProducts(params),
    getFilterOptions(),
    isAuthenticated && userId
      ? getUserWishlistIds(userId)
      : Promise.resolve([]),
  ]);

  const { products, pagination } = data;
  const { brands, categories } = filterOptions;

  const wishlistSet = new Set(wishlistIds);
  const productsWithFavorites = products.map((p) => ({
    ...p,
    isFavorite: wishlistSet.has(p.id),
  }));

  return (
    <main className="min-h-screen bg-background pb-12">
      {params.category ? (
        <ServerHero categorySlug={params.category} />
      ) : (
        <GeneralHero />
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Showing {products.length} of {pagination.totalItems} results
          </p>
        </div>
        <SortDropDown activeSort={params.sort} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pl-4">
        <aside className="w-full lg:w-64 shrink-0">
          <Suspense
            fallback={
              <div className="h-96 bg-muted animate-pulse rounded-xl" />
            }
          >
            <FilterSidebar
              categories={categories}
              brands={brands}
              activeParams={params}
            />
          </Suspense>
        </aside>

        <div className="flex-1 border border-border mask-box p-8">
          <ProductsGrid
            products={productsWithFavorites}
            isAuthenticated={isAuthenticated}
          />

          <div className="mt-12 flex justify-center">
            <PaginationControl
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          </div>
        </div>
      </div>

      <WishlistSync wishlistIds={wishlistIds} />
    </main>
  );
};

export default ProductPage;
