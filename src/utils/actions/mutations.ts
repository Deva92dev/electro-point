"use server";

// Client-callable server actions, do not use use cache/ cache here

import Stripe from "stripe";
import { and, desc, eq, inArray, isNull, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  cart,
  cartItems,
  orderItems,
  orders,
  products,
  productVariants,
  reviews,
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

export async function updateCartItemQuantity(
  productId: number,
  variantId: number | undefined,
  quantity: number
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false };

  try {
    const userCart = await db.query.cart.findFirst({
      where: eq(cart.userId, session.user.id),
    });
    if (!userCart) return { success: false };

    await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(
          eq(cartItems.cartId, userCart.id),
          variantId
            ? eq(cartItems.variantId, variantId)
            : eq(cartItems.productId, productId)
        )
      );

    return { success: true };
  } catch (err) {
    console.error("Update quantity failed:", err);
    return { success: false };
  }
}

export async function getCart(): Promise<CartItem[] | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const userCart = await db.query.cart.findFirst({
    where: eq(cart.userId, session.user.id),
    with: {
      items: {
        with: { product: true, variant: true },
        // Add explicit ordering so items don't jump around
        orderBy: (items, { desc }) => [desc(items.id)],
      },
    },
  });

  if (!userCart) return [];

  return userCart.items.map((item) => {
    const isVariant = !!item.variant;

    const rawPath =
      (isVariant ? item.variant!.imagePath : item.product.mainImagePath) || "";

    const fullImageUrl = rawPath
      ? (transformedProductImage(rawPath) as string)
      : "";

    return {
      productId: item.productId,
      variantId: item.variantId || undefined,
      name:
        item.product.name +
        (isVariant ? ` - ${item.variant!.variantName}` : ""),
      price: Number(item.priceAtAdd),
      image: fullImageUrl,
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, message: "Guest user" };
  }

  const userId = session.user.id;

  try {
    let userCart = await db.query.cart.findFirst({
      where: eq(cart.userId, userId),
    });

    if (!userCart) {
      const inserted = await db.insert(cart).values({ userId }).returning();
      userCart = inserted[0];

      if (!userCart) {
        throw new Error("Failed to create new cart in database");
      }
    }

    // DETERMINE PRICE
    let currentPrice = "0";
    if (variantId) {
      const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, variantId),
      });
      if (variant)
        currentPrice = (variant.salePrice || variant.price).toString();
    } else {
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
      });
      if (product)
        currentPrice = (product.salePrice || product.basePrice).toString();
    }

    // FIND EXISTING ITEM
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, userCart.id),
        eq(cartItems.productId, productId),
        variantId
          ? eq(cartItems.variantId, variantId)
          : isNull(cartItems.variantId)
      ),
    });

    // UPSERT
    if (existingItem) {
      await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId: userCart.id,
        productId,
        variantId: variantId ?? null,
        quantity,
        priceAtAdd: currentPrice,
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Database error" };
  }
};

export const validateCart = async (
  localItems: CartItem[]
): Promise<CartItem[]> => {
  if (localItems.length === 0) return [];

  // Get all unique IDs
  const allProductIds = Array.from(
    new Set(localItems.map((i) => Number(i.productId)))
  );

  const variantIds = localItems
    .filter((i) => i.variantId !== undefined && i.variantId !== null)
    .map((i) => Number(i.variantId));

  // Fetch Products
  const dbProducts = await db.query.products.findMany({
    where: inArray(products.id, allProductIds),
    columns: {
      id: true,
      name: true,
      basePrice: true,
      salePrice: true,
      stock: true,
      mainImagePath: true,
      isActive: true,
    },
  });

  // Fetch Variants (if any)
  let dbVariants: any[] = [];
  if (variantIds.length > 0) {
    dbVariants = await db.query.productVariants.findMany({
      where: inArray(productVariants.id, variantIds),
      with: {
        product: {
          columns: {
            id: true,
            name: true,
            mainImagePath: true,
            isActive: true,
          },
        },
      },
    });
  }

  // Validate Items
  return localItems.map((item) => {
    const isVariant = item.variantId !== undefined && item.variantId !== null;

    let isValid = false;
    let finalData = {
      price: 0,
      stock: 0,
      threshold: 5,
      name: `${item.name} (Unavailable)`,
      image: item.image,
    };

    if (isVariant) {
      // --- LOGIC FOR VARIANTS ---
      const truth = dbVariants.find((v) => v.id === Number(item.variantId));

      if (truth && truth.isActive && truth.product?.isActive) {
        isValid = true;
        const realPrice = truth.salePrice || truth.price;
        const rawImage = truth.imagePath || truth.product.mainImagePath || "";

        finalData = {
          price: parseFloat(realPrice),
          stock: truth.stockQuantity,
          threshold: truth.lowStockThreshold || 5,
          name: `${truth.product.name} - ${truth.variantName}`,
          image: rawImage
            ? (transformedProductImage(rawImage) as string)
            : item.image,
        };
      }
    } else {
      // --- LOGIC FOR SIMPLE PRODUCTS (Laptops) ---
      const truth = dbProducts.find((p) => p.id === Number(item.productId));

      if (truth && truth.isActive) {
        isValid = true;
        const realPrice = truth.salePrice || truth.basePrice;

        finalData = {
          price: parseFloat(realPrice),
          stock: truth.stock, // If this is 0 in DB, item is Out of Stock
          threshold: 5, // Hardcoded because schema lacks column
          name: truth.name,
          image: truth.mainImagePath
            ? (transformedProductImage(truth.mainImagePath) as string)
            : item.image,
        };
      }
    }

    if (!isValid) {
      return {
        ...item,
        maxStock: 0,
        quantity: 0,
        name: finalData.name,
      };
    }

    return {
      ...item,
      price: finalData.price,
      maxStock: finalData.stock,
      lowStockThreshold: finalData.threshold,
      quantity: Math.min(item.quantity, finalData.stock),
      name: finalData.name,
      image: finalData.image,
    };
  });
};

export const clearCartServer = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return;

  const userCart = await db.query.cart.findFirst({
    where: eq(cart.userId, session.user.id),
  });

  if (userCart) {
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
  }

  return { success: true };
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

export const getEligibleOrder = async (userId: string, productId: number) => {
  const result = await db
    .select({
      orderId: orders.id,
      orderDate: orders.createdAt,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orderItems.productId, productId)
        // eq(orders.status, "delivered") // Uncomment if want to track delivery status
      )
    )
    .limit(1);

  return result[0] || null;
};

export const updateProductStats = async (productId: number) => {
  const result = await db
    .select({
      count: sql<number>`count(*)`,
      avg: sql<string>`avg(${reviews.rating})`,
    })
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)));

  // Fallback to default object if result[0] is somehow undefined
  const stats = result[0] ?? { count: 0, avg: null };

  const count = Number(stats.count);
  const average = Number(stats.avg) || 0;

  // Update the Products table cache
  await db
    .update(products)
    .set({
      averageRating: average,
      totalReviews: count,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));
};

export const addReview = async (
  productId: number,
  rating: number,
  title: string,
  comment: string
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("You must be logged in to give review");
  }

  const userId = session.user.id;

  const eligibleOrder = await getEligibleOrder(userId, productId);

  if (!eligibleOrder) {
    throw new Error(
      "Verified Purchase Required: You must purchase this product to leave a review."
    );
  }
  // check for existing review
  const existing = await db.query.reviews.findFirst({
    where: and(eq(reviews.productId, productId), eq(reviews.userId, userId)),
  });

  if (existing) {
    throw new Error("You have already reviewed this product.");
  }

  // insert review
  await db.insert(reviews).values({
    userId: userId,
    userName: session.user.name,
    userEmail: session.user.email,
    productId,
    orderId: eligibleOrder.orderId,
    rating,
    title,
    comment,
    isApproved: true, // Auto-approve for now (set to false if you want admin moderation)
    isVerifiedPurchase: false, // You can link this to orders table later
  });

  await updateProductStats(productId);
  revalidatePath(`/products/${productId}`);
};

export const updateReview = async (
  reviewId: number,
  rating: number,
  title: string,
  comment: string,
  productId: number
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // verify ownership
  const review = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId),
  });

  if (!review || review.userId !== session.user.id) {
    throw new Error("You can only edit your own reviews.");
  }

  await db.update(reviews).set({
    rating,
    title,
    comment,
    updatedAt: new Date(),
  });

  await updateProductStats(productId);
  revalidatePath(`/products/${productId}`);
};

export const deleteReview = async (reviewId: number, productId: number) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(reviews)
    .where(and(eq(reviews.id, reviewId), eq(reviews.userId, session.user.id)));

  await updateProductStats(productId);
  revalidatePath(`/products/${productId}`);
};

export const getProductReview = async (productId: number) => {
  const data = await db.query.reviews.findMany({
    where: and(eq(reviews.productId, productId), eq(reviews.isApproved, true)),
    with: {
      user: {
        columns: {
          image: true,
        },
      },
    },
    orderBy: [desc(reviews.createdAt)],
  });

  return data.map((r) => ({
    ...r,
    userImage: r.user?.image || null,
  }));
};
