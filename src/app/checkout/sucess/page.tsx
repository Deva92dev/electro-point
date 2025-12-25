import { ClearCart } from "@/components/cart/ClearCart";
import { Button } from "@/components/ui/button";
import { getOrderWithRetry } from "@/utils/actions/mutations";
import { CheckCircle2, Package, SearchX } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    payment_intent?: string;
    payment_intent_client_secret?: string;
  }>;
}

const Success = async ({ searchParams }: Props) => {
  const resolvedParams = await searchParams;
  const paymentIntentId = resolvedParams.payment_intent;

  if (!paymentIntentId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">Missing Payment ID</h1>
        <Link href="/products">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  //  Fetch Order
  const order = await getOrderWithRetry(paymentIntentId);

  //  Handle "Still Not Found" (Webhook failure or extremely slow)
  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <SearchX className="w-20 h-20 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Processing...</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          We received your payment, but the order is still being generated.
          Please check your "My Orders" page in a few moments.
        </p>
        <Link href="/orders">
          <Button variant="outline">Go to My Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-muted/30">
      {/* 4. Active Cart Clearer */}
      <ClearCart />

      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-background border border-border rounded-2xl shadow-sm p-8 md:p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Thank you for your order!
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Order #{order.id} has been placed successfully.
          </p>

          {/* Order Summary */}
          <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto border border-border">
            <h2 className="font-semibold text-sm uppercase text-muted-foreground mb-4 tracking-wider">
              Order Summary
            </h2>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-foreground">
                      {item.quantity}x {item.product.name}
                    </div>
                  </div>
                  <span className="text-muted-foreground">
                    ${parseFloat(item.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border my-4" />

            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total Paid</span>
              <span>${parseFloat(order.totalAmount).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/orders">
              <Button
                variant="outline"
                className="w-full sm:w-auto min-w-[140px]"
              >
                View My Orders
              </Button>
            </Link>
            <Link href="/products">
              <Button className="w-full sm:w-auto min-w-[140px]">
                <Package className="mr-2 h-4 w-4" /> Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </main>
  );
};

export default Success;
