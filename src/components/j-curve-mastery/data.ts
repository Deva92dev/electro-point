import { cacheLife } from "next/cache";
import { db } from "@/db";
import { asc, eq, isNotNull, sql } from "drizzle-orm";
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

export const getUniqueColors = async () => {
  const newColors = await db
    .selectDistinct({
      colors: sql<string>`jsonb_array_elements(${products.availableColors})->>'name'`,
    })
    .from(products)
    // use raw sql query like this in orderBy
    .orderBy(
      asc(sql`jsonb_array_elements(${products.availableColors})->>'name'`)
    );

  const allColors = newColors.map((c) => c.colors);
  return allColors;
};

export const getAllProduct = async (colors: string) => {
  const allProducts = await db.query.products.findMany({
    where: colors
      ? (products, { sql }) =>
          sql`${products.availableColors} @> ${JSON.stringify([colors])}`
      : undefined,
    columns: {
      slug: true,
      name: true,
      productType: true,
      basePrice: true,
      salePrice: true,
    },
    with: {
      category: {
        columns: {
          name: true,
        },
      },
      variants: {
        columns: {
          color: true,
          imagePath: true,
        },
      },
    },
  });

  return allProducts;
};

export const getProductBySlug = async (slug: string) => {
  "use cache";
  cacheLife("minutes");
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    columns: {
      id: true,
      name: true,
      salePrice: true,
      basePrice: true,
      availableColors: true,
      mainImagePath: true,
      model: true,
      quickSpecs: true,
      releaseYear: true,
      slug: true,
    },
    with: {
      variants: {
        columns: {
          id: true,
          imagePath: true,
          color: true,
          lowStockThreshold: true,
          price: true,
        },
      },
      category: {
        columns: {
          id: true,
          name: true,
          productType: true,
        },
      },
    },
  });

  if (!product) {
    console.log(`${slug} not found`);
  }

  return product;
};

export type GetProductBySlug = Awaited<ReturnType<typeof getProductBySlug>>;
