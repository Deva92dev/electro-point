export interface ImageKitTransformations {
  // Basic transformations
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";

  // Cropping & resizing
  crop?: "maintain_ratio" | "force" | "at_least" | "at_max";
  cropMode?: "extract" | "pad_resize";
  focus?: "auto" | "face" | "center" | "top" | "left" | "bottom" | "right";

  // Image effects
  blur?: number; // 1-100
  grayscale?: boolean;
  contrast?: boolean;
  sharpen?: number; // 0-9

  // Rotation & flip
  rotate?: number; // 0, 90, 180, 270, 360, or "auto"
  flip?: "horizontal" | "vertical" | "both";

  // Background
  background?: string; // Hex color without # (e.g., "FFFFFF")
  backgroundRemove?: boolean;
  // Borders & radius
  border?: {
    width: number;
    color: string; // Hex without #
  };
  radius?: number | "max"; // Border radius
  // Text overlay
  textOverlay?: {
    text: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string; // Hex without #
    position?: "center" | "top" | "bottom" | "left" | "right";
    transparency?: number; // 1-100
  };
  // Image overlay
  imageOverlay?: {
    path: string;
    position?: "center" | "top" | "bottom" | "left" | "right";
    width?: number;
    height?: number;
  };
  // Progressive & optimization
  progressive?: boolean;
  lossless?: boolean;
  // Named transformation
  named?: string;
}

interface LoaderParams {
  src: string;
  width?: number;
  quality?: number;
  transformations?: ImageKitTransformations;
}

export function imagekitLoader({
  src,
  width,
  quality,
  transformations = {},
}: LoaderParams): string {
  // Remove leading slash if present
  if (src[0] === "/") src = src.slice(1);

  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    console.error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined");
    return src;
  }
  // Remove trailing slash from endpoint
  const cleanEndpoint = urlEndpoint.replace(/\/$/, "");

  // Build transformation parameters array
  const params: string[] = [];

  if (width || transformations.width) {
    params.push(`w-${width || transformations.width}`);
  }
  if (transformations.height) {
    params.push(`h-${transformations.height}`);
  }

  params.push(`q-${quality || transformations.quality || 90}`);
  params.push(`f-${transformations.format || "auto"}`);

  // Cropping
  if (transformations.crop) {
    params.push(`c-${transformations.crop}`);
  }
  if (transformations.cropMode) {
    params.push(`cm-${transformations.cropMode}`);
  }
  if (transformations.focus) {
    params.push(`fo-${transformations.focus}`);
  }
  // Effects
  if (transformations.blur) {
    params.push(`bl-${transformations.blur}`);
  }
  if (transformations.grayscale) {
    params.push("e-grayscale");
  }
  if (transformations.contrast) {
    params.push("e-contrast");
  }
  if (transformations.sharpen) {
    params.push(`e-sharpen-${transformations.sharpen}`);
  }

  if (transformations.rotate !== undefined) {
    params.push(`rt-${transformations.rotate}`);
  }
  if (transformations.flip) {
    const flipMap = {
      horizontal: "e-flip",
      vertical: "e-flop",
      both: "e-flip,e-flop",
    };
    params.push(flipMap[transformations.flip]);
  }

  if (transformations.background) {
    params.push(`bg-${transformations.background}`);
  }
  if (transformations.backgroundRemove) {
    params.push("e-removebg");
  }

  if (transformations.border) {
    params.push(
      `b-${transformations.border.width}_${transformations.border.color}`
    );
  }
  if (transformations.radius) {
    params.push(`r-${transformations.radius}`);
  }
  // Text overlay
  if (transformations.textOverlay) {
    const t = transformations.textOverlay;
    let textParams = `l-text,i-${encodeURIComponent(t.text)}`;
    if (t.fontSize) textParams += `,fs-${t.fontSize}`;
    if (t.fontFamily) textParams += `,ff-${t.fontFamily}`;
    if (t.color) textParams += `,co-${t.color}`;
    if (t.position) textParams += `,pa-${t.position}`;
    if (t.transparency) textParams += `,o-${t.transparency}`;
    params.push(textParams);
  }
  // Image overlay
  if (transformations.imageOverlay) {
    const i = transformations.imageOverlay;
    let imageParams = `l-image,i-${i.path}`;
    if (i.position) imageParams += `,pa-${i.position}`;
    if (i.width) imageParams += `,w-${i.width}`;
    if (i.height) imageParams += `,h-${i.height}`;
    params.push(imageParams);
  }
  // Progressive & optimization
  if (transformations.progressive !== false) {
    params.push("pr-true");
  }
  if (transformations.lossless) {
    params.push("lo-true");
  }
  // Named transformation
  if (transformations.named) {
    params.push(`n-${transformations.named}`);
  }

  // Construct final URL
  const paramsString = params.join(",");
  return `${cleanEndpoint}/${src}?tr=${paramsString}`;
}

export const getBlurredPlaceholder = (src: string): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: 10, // tiny size for fast loads
      height: 10,
      blur: 80, // high blur for smooth effect
      quality: 5, // Low quality saves bandwidth
      format: "auto",
    },
  });
};

export const getProductThumbnails = (src: string): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: 300,
      height: 300,
      crop: "maintain_ratio",
      quality: 85,
      format: "auto",
      progressive: true,
    },
  });
};

export const getProductCard = (src: string): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: 400,
      height: 400,
      crop: "maintain_ratio",
      format: "auto",
      progressive: true,
    },
  });
};

export const getHeroCard = (src: string): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: 600,
      height: 600,
      crop: "at_max",
      format: "auto",
      progressive: true,
    },
  });
};

export const getProductDetails = (src: string): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: 1200,
      height: 1200,
      crop: "maintain_ratio",
      quality: 95,
      format: "auto",
      progressive: true,
      sharpen: 2, // for zoom
    },
  });
};

export const getProductWithSaleBadge = (
  src: string,
  salePercent: number,
  color: string
): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: 400,
      height: 400,
      crop: "maintain_ratio",
      quality: 90,
      textOverlay: {
        text: `-${salePercent} %`,
        fontSize: 60,
        color: `${color}`,
        position: "top",
      },
    },
  });
};

export const getProductNoBackground = (src: string): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: 800,
      height: 800,
      backgroundRemove: true,
      format: "png",
      quality: 90,
    },
  });
};

// for avatars
export const getCircularImage = (src: string, size: number = 100): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: size,
      height: size,
      crop: "force",
      radius: "max", // circular
      quality: 90,
      format: "auto",
    },
  });
};

export const getMobileImage = (src: string): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: 640,
      height: 640,
      crop: "maintain_ratio",
      quality: 85,
      format: "auto",
      progressive: true,
    },
  });
};

export const getHeroImage = (src: string): string => {
  return imagekitLoader({
    src,
    transformations: {
      width: 1920,
      height: 1080,
      crop: "maintain_ratio",
      quality: 95,
      format: "auto",
      progressive: true,
      sharpen: 3,
    },
  });
};
