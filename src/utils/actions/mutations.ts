"use server";

// Client-callable server actions, do not use use cache/ cache here

import Stripe from "stripe";
import { and, desc, eq, inArray, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  cart,
  cartItems,
  orderItems,
  orders,
  products,
  productVariants,
  wishlists,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { transformedProductImage } from "../util";
import { FilteredProductsType, ProductType } from "../types";
import { CartItem } from "@/store/cart-store";
import { revalidatePath } from "next/cache";
import { ProductTypes } from "@/components/product/ProductCard/ProductCard";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

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

export async function getCart() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const userId = session.user.id;

  //  Fetch the Cart from the Database
  const userCart = await db.query.cart.findFirst({
    where: eq(cart.userId, userId),
    with: {
      items: {
        with: {
          product: true,
          variant: true,
        },
      },
    },
  });

  // If no cart exists, Webhook deleted it
  if (!userCart) {
    return [];
  }

  return userCart.items.map((item) => {
    // Check if it's a Variant or Simple Product
    const isVariant = !!item.variant;
    const entity = isVariant ? item.variant! : item.product;

    return {
      productId: item.productId,
      variantId: item.variantId || undefined,
      name:
        item.product.name +
        (isVariant ? ` - ${item.variant!.variantName}` : ""),
      price: Number(item.priceAtAdd),
      image:
        (isVariant ? item.variant!.imagePath : item.product.mainImagePath) ||
        "",
      quantity: item.quantity,
      maxStock: isVariant ? item.variant!.stockQuantity : item.product.stock,
      color: isVariant ? item.variant!.color || "Default" : "Default",
    };
  });
}

export const addToCartServer = async (
  productId: number,
  variantId: number | undefined,
  quantity: number
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Guest user" };
  }

  const userId = session.user.id;

  try {
    // Find or Create Cart
    let userCart = await db.query.cart.findFirst({
      where: eq(cart.userId, userId),
    });

    if (!userCart) {
      const inserted = await db.insert(cart).values({ userId }).returning();
      userCart = inserted[0];
      if (!userCart) throw new Error("Failed to create cart");
    }

    // FETCH REAL PRICE (Fixes the 'priceAtAdd' error & Security)
    let currentPrice = "0";

    if (variantId) {
      const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, variantId),
      });
      // Fallback logic matches your frontend logic
      if (variant) {
        currentPrice = (variant.salePrice || variant.price).toString();
      }
    } else {
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
      });
      if (product) {
        currentPrice = (product.salePrice || product.basePrice).toString();
      }
    }

    // Check for existing item in cart
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, userCart.id),
        variantId
          ? eq(cartItems.variantId, variantId)
          : eq(cartItems.productId, productId)
      ),
    });

    if (existingItem) {
      await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      // INSERT WITH REQUIRED PRICE FIELD
      await db.insert(cartItems).values({
        cartId: userCart.id,
        productId,
        variantId: variantId ?? null,
        quantity,
        priceAtAdd: currentPrice,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to sync cart:", error);
    return { success: false, error };
  }
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

type CheckoutPayload = {
  shippingAddress: any; // change in production
};

export const createOrder = async (payload: CheckoutPayload) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");
  const userId = session.user.id;

  return await db.transaction(async (tx) => {
    // Cleanup old pending orders
    const existingOrder = await tx.query.orders.findFirst({
      where: and(
        eq(orders.userId, userId),
        eq(orders.status, "pending"),
        eq(orders.paymentStatus, "pending")
      ),
      with: { items: true },
    });

    if (existingOrder) {
      for (const item of existingOrder.items) {
        if (item.variantId) {
          // Restore Variant Stock
          await tx
            .update(productVariants)
            .set({
              stockQuantity: sql`${productVariants.stockQuantity} + ${item.quantity}`,
            })
            .where(eq(productVariants.id, item.variantId));
        } else {
          // Restore Product Stock
          await tx
            .update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
      }
      await tx
        .delete(orderItems)
        .where(eq(orderItems.orderId, existingOrder.id));
      await tx.delete(orders).where(eq(orders.id, existingOrder.id));
    }

    const userCart = await tx.query.cart.findFirst({
      where: eq(cart.userId, userId),
      with: {
        items: {
          with: {
            variant: true,
            product: true,
          },
        },
      },
    });

    if (!userCart || userCart.items.length === 0)
      throw new Error("Cart is empty");

    let totalAmount = 0;

    for (const item of userCart.items) {
      let price = 0;

      if (item.variant) {
        price = item.variant.salePrice
          ? Number(item.variant.salePrice)
          : Number(item.variant.price);

        const result = await tx
          .update(productVariants)
          .set({
            stockQuantity: sql`${productVariants.stockQuantity} - ${item.quantity}`,
          })
          .where(
            sql`${productVariants.id} = ${item.variantId} AND ${productVariants.stockQuantity} >= ${item.quantity}`
          )
          .returning({ updatedId: productVariants.id });

        if (!result.length) {
          tx.rollback();
          throw new Error(`Out of stock: ${item.variant.variantName}`);
        }
      } else {
        // Accessing product fields
        price = item.product.salePrice
          ? Number(item.product.salePrice)
          : Number(item.product.basePrice);

        // locking for new stock column
        const result = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(
            sql`${products.id} = ${item.productId} AND ${products.stock} >= ${item.quantity}`
          )
          .returning({ updatedId: products.id });

        if (!result.length) {
          tx.rollback();
          throw new Error(`Out of stock: ${item.product.name}`);
        }
      }

      totalAmount += price * item.quantity;
    }

    // Stripe Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      metadata: { userId, cartId: userCart.id },
      automatic_payment_methods: { enabled: true },
    });

    // Create Order
    const insertedOrders = await tx
      .insert(orders)
      .values({
        userId,
        totalAmount: totalAmount.toString(),
        status: "pending",
        paymentStatus: "pending",
        stripePaymentIntentId: paymentIntent.id,
        shippingAddress: payload.shippingAddress,
      })
      .returning({ id: orders.id });

    const newOrder = insertedOrders[0];
    if (!newOrder) {
      tx.rollback();
      throw new Error("DB Error");
    }

    // Insert Order Items
    await tx.insert(orderItems).values(
      userCart.items.map((item) => {
        const finalPrice = item.variant
          ? item.variant.salePrice || item.variant.price
          : item.product.salePrice || item.product.basePrice;

        return {
          orderId: newOrder.id,
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
          price: finalPrice.toString(),
        };
      })
    );

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: newOrder.id,
    };
  });
};

export const getUserOrders = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    with: {
      items: {
        with: {
          product: {
            with: {
              brand: true,
            },
          },
          variant: true,
        },
      },
    },
    orderBy: [desc(orders.createdAt)],
  });

  return userOrders;
};

export async function getOrderWithRetry(paymentIntentId: string) {
  // Attempt 1: Immediate fetch
  let order = await db.query.orders.findFirst({
    where: eq(orders.stripePaymentIntentId, paymentIntentId),
    with: { items: { with: { product: true } } },
  });

  if (order) return order;

  // Attempt 2: Wait 1 second (Handling fast redirects)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  order = await db.query.orders.findFirst({
    where: eq(orders.stripePaymentIntentId, paymentIntentId),
    with: { items: { with: { product: true } } },
  });

  if (order) return order;

  // Attempt 3: Wait 2 more seconds (Handling slow webhooks)
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return await db.query.orders.findFirst({
    where: eq(orders.stripePaymentIntentId, paymentIntentId),
    with: { items: { with: { product: true } } },
  });
}
