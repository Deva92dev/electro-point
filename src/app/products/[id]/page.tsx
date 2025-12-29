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
      <ProductContent paramsPromise={props.params} />
    </main>
  );
};

export default DetailsPage;
