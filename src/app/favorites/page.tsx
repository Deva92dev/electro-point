import { Suspense } from "react";
import { FavoritesContent } from "@/components/favorites/FavoritesContent";
import { FavoritesSkeleton } from "@/components/favorites/Skeleton";

export const metadata = {
  title: "My Favorites | ElectroPoint",
  description: "Your saved products",
};

export default async function FavoritesPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <Suspense fallback={<FavoritesSkeleton />}>
        <FavoritesContent />
      </Suspense>
    </main>
  );
}
