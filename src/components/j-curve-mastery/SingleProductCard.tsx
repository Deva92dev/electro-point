import { ProductCardType } from "@/utils/types";
import ImageColorClient from "./ImageColorClient";

interface Props {
  product: ProductCardType;
  colors: string | undefined;
}

const SingleProductCard = ({ product, colors }: Props) => {
  const { basePrice, name, productType, salePrice, slug, variants } = product;
  const onSale = salePrice && salePrice < basePrice;

  return (
    <div className="group relative">
      <ImageColorClient
        variants={variants}
        name={name}
        slug={slug}
        defaultColor={colors}
      />
      {onSale && (
        <div className="absolute top-4 left-4 px-3 py-2 rounded-full text-background bg-red-500">
          SALE
        </div>
      )}
      {/* static content */}
      <div className="flex mt-8 justify-between">
        <h2 className="text-2xl font-bold text-foreground">{name}</h2>
        <p className="text-lg font-black text-muted-foreground">
          {productType}
        </p>
      </div>
      {onSale ? (
        <span className="font-bold text-red-500">
          ₹{salePrice}{" "}
          <span className="pl-4 line-through text-muted-foreground text-sm">
            {basePrice}
          </span>
        </span>
      ) : (
        <span className={`text-foreground`}>₹{basePrice}</span>
      )}
    </div>
  );
};

export default SingleProductCard;
