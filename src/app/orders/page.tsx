import { Suspense } from "react";
import { OrdersContent } from "@/components/orders/OrdersContent";
import { OrdersSkeleton } from "@/components/orders/Skeleton";

export const metadata = {
  title: "My Orders | ElectroPoint",
};

export default async function OrdersPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-muted/10">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Title renders instantly */}
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">
          Manage and track your recent purchases.
        </p>

        {/* Content streams in */}
        <Suspense fallback={<OrdersSkeleton />}>
          <OrdersContent />
        </Suspense>
      </div>
    </main>
  );
}
