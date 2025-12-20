import AddToCart from "./AddToCart";
import { GetProductBySlug } from "./data";

interface Props {
  product: GetProductBySlug;
}

const ProductsInfo = ({ product }: Props) => {
  console.log(product);
  return (
    <aside className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <h1 className="font-bold text-4xl">{product?.name}</h1>
        <p className="text-xl font-medium text-muted-foreground">
          {product?.category.productType}
        </p>
      </div>
      {/* object.entries get both values of record object of typescript */}
      <p className="font-bold text-lg text-foreground">{product?.basePrice}</p>
      <h4>Quick Specs</h4>
      {product?.quickSpecs &&
        Object.entries(product.quickSpecs).map((v) => (
          <span key={v[0]} className="flex flex-row gap-4 divide-y-2">
            <p className="text-lg font-medium capitalize">{v[0]}:</p>
            <p className="text-lg font-normal">{v[1]}</p>
          </span>
        ))}

      <AddToCart product={product} />
    </aside>
  );
};

export default ProductsInfo;
