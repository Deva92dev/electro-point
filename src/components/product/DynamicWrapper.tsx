import FilterSection from "./filter/FilterSection";
import ProductListing from "./ProductCard/ProductListing";

export async function FilterGate({
  paramsPromise,
}: {
  paramsPromise: Promise<any>;
}) {
  const params = await paramsPromise;
  return <FilterSection params={params} />;
}

export async function ListingGate({
  paramsPromise,
}: {
  paramsPromise: Promise<any>;
}) {
  const params = await paramsPromise;
  return <ProductListing params={params} />;
}
