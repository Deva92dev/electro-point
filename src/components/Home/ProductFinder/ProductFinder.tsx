import { getCategories } from "@/utils/actions/actions";
import ProductAIFinder from "./ProductAIFinder";
import { Category } from "@/utils/types";
import Lazy3DContainer from "./Lazy3DContainer";

const ProductFinder = async () => {
  const categories: Category[] = await getCategories();

  return (
    <section className="w-full pt-16 lg:pt-32 pb-8 lg:pb-12 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            Discovery Engine
          </h2>
        </div>
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT: AI Finder */}
          <div className="lg:col-span-5 h-[600px] lg:h-[650px]">
            <ProductAIFinder categories={categories} />
          </div>
          {/* RIGHT: 3D Showcase */}
          <div className="lg:col-span-7 h-[600px] lg:h-[650px]">
            <Lazy3DContainer />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFinder;
