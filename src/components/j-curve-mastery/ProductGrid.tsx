import { ProductCardType } from "@/utils/types";
import SingleProductCard from "./SingleProductCard";
import { getAllProduct } from "./data";
interface Props {
  searchParams: Promise<{
    colors?: string;
    // more added later
  }>;
}

const ProductGrid = async ({ searchParams }: Props) => {
  const { colors } = await searchParams;
  const products: ProductCardType[] = await getAllProduct(colors || "");
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {products.map((product: ProductCardType, index: number) => (
        <SingleProductCard product={product} key={index} colors={colors} />
      ))}
    </section>
  );
};

export default ProductGrid;
