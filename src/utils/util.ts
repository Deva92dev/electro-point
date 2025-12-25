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

export const formatPrice = (price: number | string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
    .format(Number(price))
    .replace("$", "$ ");
};

export const formatDate = (date: Date | null) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
