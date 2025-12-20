import {
  getAllProduct,
  getUniqueColors,
} from "@/components/j-curve-mastery/data";
import SidebarFilter from "@/components/j-curve-mastery/SidebarFilter";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    colors?: string;
  }>;
}

const MasteryPage = async ({ searchParams }: Props) => {
  const { colors } = await searchParams;
  const products = await getAllProduct(colors || "");
  const allColors = await getUniqueColors();

  // console.log(products);
  return (
    <div>
      <SidebarFilter allColors={allColors} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.slug}
            className="w-96 h-96 rounded-xl py-4 px-8 shadow-2xl backdrop-blur-2xl flex items-center justify-center"
          >
            <Link href={`/jmastery/${p.slug}`}>
              <h2>{p.name}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasteryPage;
