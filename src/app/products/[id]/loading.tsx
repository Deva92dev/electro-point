import { ProductDetailSkeleton } from "@/components/singleProduct/Skeletons";

export default function Loading() {
  return (
    <main className="bg-background min-h-screen">
      <ProductDetailSkeleton />
    </main>
  );
}
