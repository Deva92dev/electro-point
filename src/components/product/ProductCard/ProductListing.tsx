import { headers } from "next/headers";
import WishlistSync from "@/components/global/WishlistSync";
import PaginationControl from "@/components/product/Pagination/PaginationControl";
import { auth } from "@/lib/auth";
import { getAllProducts } from "@/utils/actions/actions";
import { getUserWishlistIds } from "@/utils/actions/mutations";
import SortDropDown from "@/components/product/filter/SortDropDown";
import ProductsGrid from "./ProductsGrid";

const ProductListing = async ({ params }: { params: any }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAuthenticated = !!session?.user;
  const userId = session?.user.id as string;

  const [data, wishlistIds] = await Promise.all([
    getAllProducts(params),
    isAuthenticated && userId
      ? getUserWishlistIds(userId)
      : Promise.resolve([]),
  ]);

  const { products, pagination } = data;
  const wishlistSet = new Set(wishlistIds);

  const productsWithFavorites = products.map((p) => ({
    ...p,
    isFavorite: wishlistSet.has(p.id),
  }));

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Showing {products.length} of {pagination.totalItems} results
          </p>
        </div>
        <SortDropDown activeSort={params.sort} />
      </div>

      <div className="border border-border mask-box p-4 md:p-8 rounded-xl">
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

      <WishlistSync wishlistIds={wishlistIds} />
    </>
  );
};

export default ProductListing;
