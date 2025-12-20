import { ProductDetailsType } from "@/utils/types";
import VisualHero from "./VisualHero";
import FeatureShowcase from "./FeatureShowcase";

type Props = {
  product: NonNullable<ProductDetailsType>;
  isAuthenticated: boolean;
  isFavorite: boolean;
};

const LayoutB = ({ product, isAuthenticated, isFavorite }: Props) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30">
      <VisualHero
        product={product}
        isAuthenticated={isAuthenticated}
        isFavorite={isFavorite}
      />
      <FeatureShowcase product={product} />
      <div className="max-w-4xl mx-auto px-4 pb-32">
        <h3 className="text-2xl font-bold mb-8 text-center text-white/50">
          Technical Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm text-zinc-400">
          {Object.entries(product.specs || {}).map(([key, value]) => {
            if (
              ["id", "productId", "createdAt", "updatedAt"].includes(key) ||
              !value
            )
              return null;

            return (
              <div
                key={key}
                className="flex justify-between border-b border-white/10 py-2"
              >
                <span className="capitalize">
                  {key.replace(/(A-Z)/g, "$1")}
                </span>
                <span className="text-white">{String(value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LayoutB;
