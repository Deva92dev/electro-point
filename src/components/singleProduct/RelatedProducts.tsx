import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRelatedProducts } from "@/utils/actions/actions";
import { ProductDetailsType } from "@/utils/types";
import { formatPrice } from "@/utils/util";

interface Props {
  currentProduct: NonNullable<ProductDetailsType>;
}

const RelatedProducts = async ({ currentProduct }: Props) => {
  const tagNames = currentProduct.tags?.map((t: any) => t.tag.name) || [];

  const { alternatives, ecosystem } = await getRelatedProducts(
    currentProduct.id,
    currentProduct.categoryId,
    tagNames
  );

  const allRelated = [...alternatives, ...ecosystem].slice(0, 4);

  if (allRelated.length === 0) return null;

  return (
    <section className="py-24 border-t border-border">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        {/*  Header  */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Complete Your Setup
          </h2>
          <p className="text-muted-foreground">
            Alternatives and ecosystem pairings curated for you.
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
        >
          View Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {allRelated.map((prod) => {
          const isAlternative = prod.productType === currentProduct.productType;
          const label = isAlternative ? "Alternative" : "Perfect Pairing";
          const labelColor = isAlternative
            ? "bg-zinc-100 text-zinc-800"
            : "bg-primary/10 text-primary";

          return (
            <Link
              key={prod.id}
              href={`/products/${prod.id}`}
              className="group block"
            >
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-muted/20 border border-border transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg">
                <div
                  className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${labelColor}`}
                >
                  {label}
                </div>
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                  <Image
                    src={prod.mainImagePath}
                    alt={prod.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2"
                    unoptimized
                  />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 bg-background/80 backdrop-blur-sm border-t border-border translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold truncate">{prod.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(parseFloat(prod.basePrice))}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full hover:bg-primary hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-3 group-hover:opacity-50 transition-opacity">
                <h3 className="font-medium text-sm truncate">{prod.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(parseFloat(prod.basePrice))}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;
