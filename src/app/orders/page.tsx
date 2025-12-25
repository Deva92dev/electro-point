import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MapPin } from "lucide-react";
import { getUserOrders } from "@/utils/actions/mutations";
import { formatDate } from "@/utils/util";
import { Badge } from "@/components/ui/badge";
import { getProductCard } from "@/lib/imagekit-loader";

export const metadata = {
  title: "My Orders | ElectroPoint",
};

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userOrders = await getUserOrders();

  return (
    <main className="min-h-screen pt-24 pb-20 bg-muted/10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">
          Manage and track your recent purchases.
        </p>

        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-background border border-border rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't placed any orders yet. Start shopping to fill this
              page with amazing gadgets.
            </p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-background border border-border rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Order Header */}
                <div className="bg-muted/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-0.5">
                        Order Placed
                      </span>
                      <span className="font-medium text-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-0.5">
                        Total
                      </span>
                      <span className="font-medium text-foreground">
                        ${parseFloat(order.totalAmount).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-0.5">
                        Order #
                      </span>
                      <span className="font-medium text-foreground font-mono">
                        {order.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "default"
                          : order.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-6">
                    {order.items.map((item) => {
                      const isVariant = !!item.variant;
                      const rawImage = isVariant
                        ? item.variant!.imagePath
                        : item.product.mainImagePath;

                      const validImage = rawImage
                        ? getProductCard(rawImage)
                        : "/placeholder.jpg";

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row gap-4 sm:items-center"
                        >
                          <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0 border border-border">
                            <Image
                              src={validImage}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <Link
                                  href={`/products/${item.product.id}`}
                                  className="font-medium text-foreground hover:underline line-clamp-1"
                                >
                                  {item.product.name}
                                </Link>

                                {/* Only show variant details if variant exists */}
                                {isVariant && item.variant && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {item.variant.color && (
                                      <span className="capitalize">
                                        {item.variant.color}
                                      </span>
                                    )}
                                    {item.variant.storage && (
                                      <> • {item.variant.storage}</>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  ${parseFloat(item.price).toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  Qty: {item.quantity}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action (Buy Again) */}
                          <div className="sm:ml-4 flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            <Link href={`/products/${item.product.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                Buy Again
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-muted/10 px-6 py-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-md">
                    {(order.shippingAddress as any)?.street},{" "}
                    {(order.shippingAddress as any)?.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
