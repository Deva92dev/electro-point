import ProductCard, { ProductTypes } from "./ProductCard";

interface Props {
  products: ProductTypes[];
  isAuthenticated: boolean;
}

const ProductsGrid = ({ products, isAuthenticated }: Props) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
