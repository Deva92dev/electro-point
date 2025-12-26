import { getFilterOptions } from "@/utils/actions/actions";
import FilterSidebar from "./FilterSidebar";

const FilterSection = async ({ params }: { params: any }) => {
  const { brands, categories } = await getFilterOptions();
  return (
    <FilterSidebar
      categories={categories}
      brands={brands}
      activeParams={params}
    />
  );
};

export default FilterSection;
