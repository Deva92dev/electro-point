import { Suspense } from "react";
import { ProductDetailSkeleton } from "@/components/singleProduct/Skeletons";
import { ProductContent } from "@/components/singleProduct/ProductContent";
import { getProductIds } from "@/utils/actions/filter-actions";

export async function generateStaticParams() {
  const products = await getProductIds();

  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

const DetailsPage = async (props: PageProps) => {
  return (
    <main className="bg-background">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductContent paramsPromise={props.params} />
      </Suspense>
    </main>
  );
};

export default DetailsPage;
