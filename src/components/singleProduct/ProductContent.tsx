import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProductById } from "@/utils/actions/actions";
import { getUserWishlistIds } from "@/utils/actions/mutations";
import LayoutA from "./LayoutA";
import LayoutB from "./LayoutB";
import LayoutC from "./LayoutC";
import RelatedProducts from "./RelatedProducts";
import WishlistSync from "../global/WishlistSync";
import ReviewsSection from "../reviews/ReviewSection";

interface Props {
  paramsPromise: Promise<{ id: string }>;
}

export async function ProductContent({ paramsPromise }: Props) {
  const { id } = await paramsPromise;
  const productId = Number(id);
  if (isNaN(productId)) notFound();

  const [product, session] = await Promise.all([
    getProductById(productId),
    auth.api.getSession({
      headers: await headers(),
    }),
  ]);

  if (!product) notFound();

  const userId = session?.user?.id;
  const isAuthenticated = !!session?.user;

  let wishlistIds: number[] = [];
  if (isAuthenticated && userId) {
    wishlistIds = await getUserWishlistIds(userId);
  }
  const isFavorite = wishlistIds.includes(productId);

  const layoutProps = {
    product,
    isAuthenticated,
    isFavorite,
  };

  const LayoutComponent = () => {
    switch (product.productType) {
      case "laptop":
      case "tv":
        return <LayoutA {...layoutProps} />;
      case "smartphone":
      case "headphones":
        return <LayoutB {...layoutProps} />;
      case "smartwatch":
      case "tablet":
        return <LayoutC {...layoutProps} />;
      default:
        return <LayoutA {...layoutProps} />;
    }
  };

  return (
    <>
      <LayoutComponent />

      <ReviewsSection
        productId={productId}
        isAuthenticated={isAuthenticated}
        userId={userId}
      />
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <RelatedProducts currentProduct={product} />
      </div>
      <WishlistSync wishlistIds={wishlistIds} />
    </>
  );
}
