import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserWishlistIds } from "@/utils/actions/mutations";
import ProductsGrid from "./ProductsGrid";
import { ProductSearchParams } from "@/utils/types";
import { getAllProducts } from "@/utils/actions/filter-actions";
import { getProductCard, getProductThumbnails } from "@/lib/imagekit-loader";
import PaginationControl from "../Pagination/PaginationControl";
import WishlistSync from "@/components/global/WishlistSync";
import SortDropDown from "../filter/SortDropDown";

interface Props {
  params: ProductSearchParams;
}

const ProductListing = async ({ params }: Props) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const [data, wishlistIds] = await Promise.all([
    getAllProducts(params),
    userId ? getUserWishlistIds(userId) : Promise.resolve([]),
  ]);

  const { products, pagination } = data;
  const wishlistSet = new Set(wishlistIds.map((id) => Number(id)));

  const formattedProducts = products.map((p) => {
    // If user filtered by color, try to show that variant's image first
    let activeRawPath = p.mainImagePath;

    if (params.color) {
      const matchingVariant = p.variants.find(
        (v) => v.color?.toLowerCase() === params.color?.toLowerCase()
      );
      if (matchingVariant?.imagePath) {
        activeRawPath = matchingVariant.imagePath;
      }
    }

    return {
      ...p,
      id: Number(p.id),
      mainImagePath: getProductCard(activeRawPath || ""),

      variants: p.variants.map((v) => ({
        id: v.id,
        color: v.color,
        stock: v.stockQuantity,
        image: getProductThumbnails(v.imagePath || ""),
      })),
      isFavorite: wishlistSet.has(Number(p.id)),
    };
  });

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Showing {formattedProducts.length} of {pagination.totalItems}{" "}
            results
          </p>
        </div>

        <SortDropDown activeSort={params.sort} />
      </div>

      <div className="border border-border mask-box p-4 md:p-8 rounded-xl">
        <ProductsGrid products={formattedProducts} isAuthenticated={!!userId} />

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
