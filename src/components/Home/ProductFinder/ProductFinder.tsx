import dynamic from "next/dynamic";
import { getCategories } from "@/utils/actions/actions";
import ProductAIFinder from "./ProductAIFinder";
import { Category } from "@/utils/types";

const Product3D = dynamic(() => import("./Product3D"), {
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-muted/20 rounded-3xl">
      <p className="animate-pulse text-muted-foreground">Loading 3D View...</p>
    </div>
  ),
});

const ProductFinder = async () => {
  const categories: Category[] = await getCategories();
  console.log(categories);

  return (
    <section
      className="flex flex-col lg:flex-row w-full h-auto lg:h-[800px] py-12 lg:py-24      
        gap-12 lg:gap-0 relative z-10 overflow-hidden"
    >
      <div className="w-full lg:w-[40vw] px-4 md:px-8 lg:px-4 flex items-center justify-center bg-inherit z-20">
        <ProductAIFinder categories={categories} />
      </div>
      <div className="relative w-full lg:w-[60vw] h-[500px] lg:h-full flex items-center justify-center px-4 z-10">
        <Product3D />
      </div>
    </section>
  );
};

export default ProductFinder;
