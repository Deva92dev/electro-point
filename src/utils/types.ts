import { products } from "@/db/schema";
import { StaticImageData } from "next/image";
import { getHeroImages, getProductById } from "./actions/actions";

/** Inferred directly from Drizzle Schema to prevent drift */
export type ProductType = (typeof products.productType.enumValues)[number];

export const categoryTypes: ProductType[] = [
  "laptop",
  "smartphone",
  "headphones",
  "tablet",
  "smartwatch",
  "tv",
];

/** Used for AI Finder quick comparisons.*/
export type SpecRecord = Record<string, string | number | boolean | undefined>;

/** Unified for the Hero and Quiz components*/
export interface Category {
  id: number;
  name: string;
  productType: ProductType;
  imageUrl: string | StaticImageData;
}

/**
 * 4. FILTERED PRODUCT (FOR AI FINDER)
 * FIXED: ID changed to number to match PostgreSQL Serial type.
 */
export interface FilteredProduct {
  id: number;
  name: string;
  mainImagePath: string;
  basePrice: string;
  productType: ProductType;
  quickSpecs: SpecRecord;
  // Optional relations from the 'with' query
  laptopSpecs?: SpecRecord | null;
  smartphoneSpecs?: SpecRecord | null;
}

export type FilteredProductsType = FilteredProduct[];

/** Explicitly defined to prevent circular dependencies with Actions.*/
export interface ProductCardType {
  id: number;
  name: string;
  slug: string;
  basePrice: string;
  salePrice: string | null;
  productType: ProductType;
  mainImagePath: string;
  variants: {
    color: string | null;
    imagePath: string | null;
  }[];
  category: {
    name: string;
  };
}

export interface ComparisonProduct {
  id: number;
  name: string;
  slug: string;
  mainImagePath: string;
  quickSpecs: SpecRecord | null;
}

export type ProductDetailsType = Awaited<ReturnType<typeof getProductById>>;
export type HeroImage = Awaited<ReturnType<typeof getHeroImages>>[number];

export interface ProductSearchParams {
  page?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  color?: string;
  search?: string;
  brand?: string;
  category?: string;
  productType?: string;
}

export interface ProductFrontend {
  id: number;
  name: string;
  slug: string;
  mainImagePath: string;
  basePrice: string;
  salePrice: string | null;
  isFavorite: boolean;
  brand: { name: string } | null;
  category: { name: string };
  availableColors: { name: string; hex: string }[] | null;
  variants: {
    id: number;
    color: string | null;
    image: string;
    stock: number;
  }[];
}
