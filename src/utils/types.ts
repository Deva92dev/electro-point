import { products } from "@/db/schema";
import { getHeroImages, getProductsFinder } from "./actions";

export type HeroImage = Awaited<ReturnType<typeof getHeroImages>>[number];
export interface category {
  id: number;
  name: string;
  productType: string | null;
  imageUrl?: string | null;
}

export type Category = {
  imageUrl: string;
  id: number;
  name: string;
  productType:
    | "laptop"
    | "smartphone"
    | "headphones"
    | "tablet"
    | "smartwatch"
    | "tv";
};

export const categoryTypes = [
  "laptop",
  "smartphone",
  "headphones",
  "tablet",
  "smartwatch",
  "tv",
] as const;

export type ProductsFinderData = Awaited<ReturnType<typeof getProductsFinder>>;
export type ProductFinderItem = ProductsFinderData[number];

export interface ProductFinderData {
  id: number;
  name: string;
  mainImagePath: string | null;
  basePrice: string;
  salePrice?: string | null;
  productType: string;
  quickSpecs: Record<string, string | undefined>;
  categoryName: string;
}

export type ProductType = (typeof products.productType.enumValues)[number];

export type FilteredProduct = {
  id: string;
  name: string;
  mainImagePath: string;
  basePrice: string;
  productType: ProductType;
  quickSpecs: unknown;
};

export type FilteredProductsType = FilteredProduct[];
