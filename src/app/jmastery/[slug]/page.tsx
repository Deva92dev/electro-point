import { getProductBySlug } from "@/components/j-curve-mastery/data";
import GalleryProducts from "@/components/j-curve-mastery/GalleryProducts";
import ProductsInfo from "@/components/j-curve-mastery/ProductsInfo";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const JMasteryDetails = async ({ params }: Props) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <main className="flex flex-col gap4 lg:flex-row lg:gap-8">
      <div className="col-span-2 my-8">
        <GalleryProducts product={product} />
      </div>
      <div className="col-span-1 my-8">
        <ProductsInfo product={product} />
      </div>
    </main>
  );
};

export default JMasteryDetails;
