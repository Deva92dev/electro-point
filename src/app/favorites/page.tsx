import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getUserWishlistProducts } from "@/utils/actions/mutations";
import ProductCard from "@/components/product/ProductCard/ProductCard";

export const metadata = {
  title: "My Favorites | ElectroPoint",
  description: "Your saved products",
};

export default async function FavoritesPage() {
  const products = await getUserWishlistProducts();

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? "item" : "items"} saved
            for later
          </p>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <Heart className="w-10 h-10 text-muted-foreground fill-current opacity-50" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tap the heart icon on any product to save it here for later.
              </p>
            </div>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAuthenticated={true}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
