import { getProductForComparison } from "@/utils/actions/actions";
import SpecWarsClient from "./SpecWarsClient";

const ComparisonServer = async () => {
  const products = await getProductForComparison();

  return (
    <section className="py-24 w-full px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <SpecWarsClient products={products} />
      </div>
    </section>
  );
};

export default ComparisonServer;
