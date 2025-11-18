import Hero from "@/components/Home/Hero/Hero";
import ProductFinder from "@/components/Home/ProductFinder/ProductFinder";

// fix hero is taking too much space, when i scroll after 3-4 hero images(i mean when they start going out of viewport), i should start seeing ProductFinder component
export default async function Home() {
  return (
    <>
      <Hero />
      <ProductFinder />
    </>
  );
}
