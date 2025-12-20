import AuthImage from "@/assets/Auth.webp";
import {
  getHeroCard,
  getHeroImage,
  getProductCard,
  getProductDetails,
} from "@/lib/imagekit-loader";

export const transformedProductImage = (
  path: string | null,
  loader: "card" | "hero" | "details" = "card"
) => {
  if (!path) return AuthImage;
  const encoded = encodeURI(path);
  if (loader === "hero") return getHeroCard(encoded);
  if (loader === "details") return getProductDetails(encoded);
  return getProductCard(encoded);
};
