import { ProductsGridType } from "@/utils/types";
import ProductList from "./ProductList";

interface Props {
  products: ProductsGridType[];
}

const ProductsGrid = ({ products }: Props) => {
  if (products.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/10">
        <p className="text-lg font-medium text-muted-foreground">
          No products found.
        </p>
        <p className="text-sm text-muted-foreground/60">
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return <ProductList products={products} />;
};

export default ProductsGrid;
