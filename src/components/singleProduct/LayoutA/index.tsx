import { ProductDetailsType } from "@/utils/types";
import { Suspense } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

type Props = {
  product: NonNullable<ProductDetailsType>;
  isAuthenticated: boolean;
  isFavorite: boolean;
};

const LayoutA = ({ product, isAuthenticated, isFavorite }: Props) => {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* left Sticky Gallery */}
          <div className="w-full lg:w-[60%] shrink-0">
            <div className="sticky top-24">
              <Suspense>
                <ProductGallery
                  images={product.images}
                  productName={product.name}
                />
              </Suspense>
            </div>
          </div>
          {/* Right Scrollable Tech specs */}
          <div className="w-full lg:w-[40%]">
            <ProductInfo
              product={product}
              isAuthenticated={isAuthenticated}
              isFavorite={isFavorite}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutA;
