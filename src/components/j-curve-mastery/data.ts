import { cacheLife } from "next/cache";
import { db } from "@/db";
import { isNotNull } from "drizzle-orm";
import { products } from "@/db/schema";
import { getHeroCard } from "@/lib/imagekit-loader";

// aggregate values like min are used with in conjunction to groupBy
export const getCategoriesWithImages = async () => {
  "use cache";
  cacheLife({ expire: 3600 });

  const categoryResult = await db.query.categories.findMany({
    columns: {
      slug: true,
      name: true,
      id: true,
    },
    with: {
      products: {
        limit: 1,
        where: isNotNull(products.mainImagePath),
        columns: {
          mainImagePath: true,
        },
      },
    },
  });

  const processedResult = categoryResult.map((cat) => {
    const rawImagePath = cat.products[0]?.mainImagePath;

    const imageUrl = rawImagePath
      ? getHeroCard(encodeURI(rawImagePath))
      : "/placeholder.jpg";

    return {
      id: cat.id,
      name: cat.name,
      productType: cat.slug,
      imageUrl: imageUrl,
    };
  });

  return processedResult;
};
