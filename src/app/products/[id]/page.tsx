import { Suspense } from "react";
import { ProductDetailSkeleton } from "@/components/singleProduct/Skeletons";
import { ProductContent } from "@/components/singleProduct/ProductContent";

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
