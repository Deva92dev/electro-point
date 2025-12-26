import { db } from "@/db";
import { cart, orders, productVariants, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!.trim();

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.PaymentIntent;

  // PAYMENT SUCCEEDED
  if (event.type === "payment_intent.succeeded") {
    try {
      const order = await db.query.orders.findFirst({
        where: eq(orders.stripePaymentIntentId, session.id),
      });

      if (!order) {
        return new NextResponse("Order not found", { status: 200 });
      }

      await db
        .update(orders)
        .set({
          status: "processing",
          paymentStatus: "paid",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      if (order.userId) {
        await db.delete(cart).where(eq(cart.userId, order.userId));
      }
    } catch (err: any) {
      return new NextResponse(`DB Error: ${err.message}`, { status: 500 });
    }
  }

  // PAYMENT FAILED / CANCELLED
  if (
    event.type === "payment_intent.payment_failed" ||
    event.type === "payment_intent.canceled"
  ) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.stripePaymentIntentId, session.id),
      with: { items: true },
    });

    if (order && order.paymentStatus === "pending") {
      await db.transaction(async (tx) => {
        // Restore stock for each item
        for (const item of order.items) {
          if (item.variantId) {
            // Case A: It is a Variant -> Restore Variant Stock
            await tx
              .update(productVariants)
              .set({
                stockQuantity: sql`${productVariants.stockQuantity} + ${item.quantity}`,
              })
              .where(eq(productVariants.id, item.variantId));
          } else {
            // Case B: It is a Simple Product -> Restore Product Stock
            await tx
              .update(products)
              .set({
                stock: sql`${products.stock} + ${item.quantity}`,
              })
              .where(eq(products.id, item.productId));
          }
        }

        // Mark Order as Cancelled
        await tx
          .update(orders)
          .set({ status: "cancelled", paymentStatus: "failed" })
          .where(eq(orders.id, order.id));
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
