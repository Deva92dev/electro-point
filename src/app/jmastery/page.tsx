import SidebarFilter from "@/components/j-curve-mastery/SidebarFilter";
import { getAllProduct, getUniqueColors } from "@/utils/actions";

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
    </div>
  );
};

export default MasteryPage;
