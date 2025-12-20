import { notFound } from "next/navigation";
import LayoutA from "@/components/singleProduct/LayoutA";
import LayoutB from "@/components/singleProduct/LayoutB";
import LayoutC from "@/components/singleProduct/LayoutC";
import { getProductById } from "@/utils/actions/actions";
import RelatedProducts from "@/components/singleProduct/RelatedProducts";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserWishlistIds } from "@/utils/actions/mutations";
import WishlistSync from "@/components/global/WishlistSync";

type PageProps = {
  params: Promise<{ id: string }>;
};

const DetailsPage = async (props: PageProps) => {
  const { id } = await props.params;
  const productId = Number(id);
  if (isNaN(productId)) notFound;

  const product = await getProductById(productId);
  if (!product) notFound();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user.id as string;
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

  // can place favorite toggle function anywhere after layoutProps logic
  const renderLayout = () => {
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
    <main className="bg-background">
      {renderLayout()}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <RelatedProducts currentProduct={product} />
      </div>
      <WishlistSync wishlistIds={wishlistIds} />
    </main>
  );
};

export default DetailsPage;
