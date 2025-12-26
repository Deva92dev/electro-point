import GeneralHero from "./GeneralHero";
import ServerHero from "./ServerHero";

const HeroSection = async ({
  paramsPromise,
}: {
  paramsPromise: Promise<any>;
}) => {
  const params = await paramsPromise;
  return params.productType ? (
    <ServerHero categorySlug={params.productType} />
  ) : (
    <GeneralHero />
  );
};

export default HeroSection;
