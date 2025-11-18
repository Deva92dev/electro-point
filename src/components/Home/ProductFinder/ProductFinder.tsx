import dynamic from "next/dynamic";
import { getCategories } from "@/utils/actions";
import ProductAIFinder from "./ProductAIFinder";
import { Category } from "@/utils/types";
// import { getAllSpecs } from "@/lib/data";

const Product3D = dynamic(() => import("./Product3D"), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p>Loading 3D View...</p>
    </div>
  ),
});

const ProductFinder = async () => {
  const categories: Category[] = await getCategories();
  // const allSpecs = await getAllSpecs();
  // console.log(allSpecs);

  return (
    <section className="flex flex-col lg:flex-row w-full min-h-[800px] py-24">
      <div className="lg:w-[40vw] px-4 py-8 items-center justify-center bg-inherit">
        <ProductAIFinder categories={categories} />
      </div>
      <div className="relative lg:w-[60vw] flex items-center justify-center py-8">
        <Product3D />
      </div>
    </section>
  );
};

export default ProductFinder;
