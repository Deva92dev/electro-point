"use server";

// Client-callable server actions, do not use use cache/ cache here

import { and, eq, inArray, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, productVariants, wishlists } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { transformedProductImage } from "../util";
import { FilteredProductsType, ProductType } from "../types";
import { CartItem } from "@/store/cart-store";
import { revalidatePath } from "next/cache";
import { ProductTypes } from "@/components/product/ProductCard/ProductCard";

export const getFilteredProducts = async (filters: {
  productType?: string | null;
  maxBudget?: number;
  priority?: string | null;
}): Promise<FilteredProductsType> => {
  const { productType, maxBudget, priority } = filters;

  const rawResults = await db.query.products.findMany({
    where: and(
      eq(products.isActive, true),
      productType ? eq(products.productType, productType as any) : undefined,
      maxBudget
        ? lte(products.basePrice, sql`${maxBudget}::numeric`)
        : undefined
    ),
    with: {
      laptopSpecs: true,
      smartphoneSpecs: true,
      tabletSpecs: true,
      smartwatchSpecs: true,
      headphonesSpecs: true,
      tvSpecs: true,
    },
    limit: 10,
  });

  const mappedResults: FilteredProductsType = rawResults.map((p) => {
    const specMap: Record<string, any> = {
      laptop: p.laptopSpecs,
      smartphone: p.smartphoneSpecs,
      tablet: p.tabletSpecs,
      smartwatch: p.smartwatchSpecs,
      headphones: p.headphonesSpecs,
      tv: p.tvSpecs,
    };

    const resolvedSpecs = specMap[p.productType] || {};

    return {
      id: Number(p.id),
      name: p.name,
      mainImagePath: (p.mainImagePath
        ? transformedProductImage(p.mainImagePath)
        : "/placeholder.jpg") as string,
      basePrice: p.basePrice,
      productType: p.productType as ProductType,
      quickSpecs: {
        ...(p.quickSpecs as Record<string, string | undefined>),
        ...Object.fromEntries(
          Object.entries(resolvedSpecs).map(([k, v]) => [k, v?.toString()])
        ),
      } as Record<string, string | undefined>,
    };
  });

  return mappedResults.slice(0, 6);
};

export const getUserWishlistIds = async (userId: string) => {
  if (!userId) return [];
  const wishlistItems = await db.query.wishlists.findMany({
    where: eq(wishlists.userId, userId),
    columns: { productId: true },
  });

  return wishlistItems.map((w) => w.productId);
};

export const toggleWishlistAction = async (productId: number, path: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  // if exists
  const existing = await db.query.wishlists.findFirst({
    where: and(
      eq(wishlists.userId, userId),
      eq(wishlists.productId, productId)
    ),
  });

  if (existing) {
    // remove
    await db.delete(wishlists).where(eq(wishlists.id, existing.id));
    revalidatePath(path);
    return { success: true, action: "Removed from Wishlist" };
  } else {
    // add
    await db.insert(wishlists).values({
      userId,
      productId,
    });
    revalidatePath(path);
    return {
      success: true,
      action: existing ? "Removed from Wishlist" : "Added to Wishlist",
    };
  }
};

export const getUserWishlistProducts = async (): Promise<ProductTypes[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  // Fetch Wishlist Items with relations
  const wishlistItems = await db.query.wishlists.findMany({
    where: eq(wishlists.userId, session.user.id),
    with: {
      product: {
        with: {
          brand: true,
          category: true,
          // Get active variants only
          variants: { where: eq(productVariants.isActive, true) },
        },
      },
    },
    orderBy: (w, { desc }) => [desc(w.createdAt)],
  });

  // Map to ProductCard Interface
  return wishlistItems.map((w) => {
    const p = w.product;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      isFavorite: true,
      mainImagePath: transformedProductImage(p.mainImagePath) as string,
      basePrice: p.basePrice,
      salePrice: p.salePrice,
      availableColors: p.availableColors as
        | { name: string; hex: string }[]
        | null,
      brand: p.brand,
      category: p.category,
      // Transform Variant Images & Map Keys
      variants: p.variants.map((v) => ({
        id: v.id,
        color: v.color,
        stock: v.stockQuantity,
        image: transformedProductImage(v.imagePath) as string,
      })),
    };
  });
};

export const validateCart = async (
  localItems: CartItem[]
): Promise<CartItem[]> => {
  if (localItems.length === 0) return [];

  const variantIds = localItems
    .map((i) => i.variantId)
    .filter((id): id is number => id !== undefined);

  if (variantIds.length === 0) return localItems;

  const dbVariants = await db
    .select({
      id: productVariants.id,
      price: productVariants.salePrice,
      basePrice: productVariants.price,
      stock: productVariants.stockQuantity,
      lowStockThreshold: productVariants.lowStockThreshold,
      productName: products.name,
      variantName: productVariants.variantName,
      productImage: products.mainImagePath,
      variantImage: productVariants.imagePath,
      isActive: productVariants.isActive,
      productActive: products.isActive,
    })
    .from(productVariants)
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(inArray(productVariants.id, variantIds));

  const validatedItems: CartItem[] = localItems.map((item) => {
    const truth = dbVariants.find((v) => v.id === item.variantId);

    if (!truth || !truth.isActive || !truth.productActive) {
      return {
        ...item,
        maxStock: 0,
        quantity: 0,
        price: 0,
        name: `${item.name} (Unavailable)`,
      };
    }

    const realPrice = truth.price
      ? parseFloat(truth.price)
      : parseFloat(truth.basePrice);

    const rawImagePath = truth.variantImage || truth.productImage || "";
    const validImageUrl = rawImagePath
      ? transformedProductImage(rawImagePath)
      : transformedProductImage(item.image);

    return {
      ...item,
      price: realPrice,
      maxStock: truth.stock,
      lowStockThreshold: truth.lowStockThreshold || 5,
      quantity: Math.min(item.quantity, truth.stock),
      name: truth.productName,
      image: validImageUrl as string,
    };
  });

  return validatedItems;
};
