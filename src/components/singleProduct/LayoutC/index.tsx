import { ProductDetailsType } from "@/utils/types";
import HeroConfigurator from "./HeroConfigurator";
import Ecosystem from "./Ecosystem";

type Props = {
  product: NonNullable<ProductDetailsType>;
  isAuthenticated: boolean;
  isFavorite: boolean;
};

const LayoutC = ({ product, isAuthenticated, isFavorite }: Props) => {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mb-24">
        <HeroConfigurator
          product={product}
          isAuthenticated={isAuthenticated}
          isFavorite={isFavorite}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <Ecosystem product={product} />
      </div>
    </div>
  );
};

export default LayoutC;
