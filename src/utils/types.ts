import { products } from "@/db/schema";
import { getAllProducts, getHeroImages, getProductsFinder } from "./actions";

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

export interface ComparisonProduct {
  id: number;
  name: string;
  slug: string;
  mainImagePath: string;
  quickSpecs: Record<string, string | undefined> | null;
}

// this is how same color equals same image match in db

export interface VariantsType {
  color: string | null;
  imagePath: string | null;
}
export interface ProductCardType {
  basePrice: string;
  name: string;
  productType:
    | "laptop"
    | "smartphone"
    | "headphones"
    | "tablet"
    | "smartwatch"
    | "tv";
  salePrice: string | null;
  slug: string;
  variants: {
    color: string | null;
    imagePath: string | null;
  }[];
  category: {
    name: string;
  };
}

export type GetAllProductsType = Awaited<ReturnType<typeof getAllProducts>>;

export interface ProductsGridType {
  mainImagePath: string;
  variants: {
    color: string | null;
    image: string;
  }[];
  id: number;
  name: string;
  slug: string;
  productType:
    | "laptop"
    | "smartphone"
    | "headphones"
    | "tablet"
    | "smartwatch"
    | "tv";
  availableColors:
    | {
        name: string;
        hex: string;
      }[]
    | null;
  basePrice: string;
  salePrice: string | null;
  brand: {
    name: string;
  } | null;
  category: {
    name: string;
  };
}
