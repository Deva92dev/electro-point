import { ProductsGridType } from "@/utils/types";
import ProductCard from "./ProductCard";

interface Props {
  products: ProductsGridType[];
}

const ProductList = ({ products }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 row-auto">
      {products.map((product: ProductsGridType) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
