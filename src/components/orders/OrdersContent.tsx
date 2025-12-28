import { MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getProductCard } from "@/lib/imagekit-loader";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/util";
import { getUserOrders } from "@/utils/actions/mutations";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function OrdersContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userOrders = await getUserOrders();

  if (userOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-background border border-border rounded-xl shadow-sm text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
        <p className="text-muted-foreground max-w-sm mb-6">
          You haven't placed any orders yet. Start shopping to fill this page
          with amazing gadgets.
        </p>
        <Link href="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                        sizes="100px"
                        unoptimized
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
                        <Button variant="outline" size="sm" className="w-full">
                          Buy Again
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Address */}
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
  );
}
