import { Suspense } from "react";
import { ClearCart } from "@/components/cart/ClearCart";
import { SuccessContent } from "@/components/checkout/SuccessContent";
import { SuccessSkeleton } from "@/components/checkout/SuccessSkeleton";

interface Props {
  searchParams: Promise<{
    payment_intent?: string;
    payment_intent_client_secret?: string;
  }>;
}

const Success = ({ searchParams }: Props) => {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-muted/30">
      <ClearCart />

      <Suspense fallback={<SuccessSkeleton />}>
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
};

export default Success;
