"use client";
import Image from "next/image";
import { imagekitLoader } from "@/lib/imagekit-loader";
import type { ImageKitTransformations } from "@/lib/imagekit-loader";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  mobileWidth?: number; // Width for screens <640px (default: 400px)
  tabletWidth?: number; // Width for screens 640-1024px (default: 600px)
  desktopWidth?: number; // Width for screens >1024px (default: 800px)
  mobileQuality?: number;
  desktopQuality?: number;
  blurIntensity?: "light" | "medium" | "heavy";
  transformations?: ImageKitTransformations;
  objectFit?: "contain" | "cover";
}

export function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  mobileWidth = 400,
  tabletWidth = 600,
  desktopWidth = 800,
  mobileQuality = 80,
  desktopQuality = 90,
  transformations = {},
  objectFit = "contain",
}: ResponsiveImageProps) {
  const blurDataURL = imagekitLoader({
    src,
    transformations: {
      width: 10,
      height: 10,
      blur: 80,
      quality: 5,
    },
  });

  // Generate URLs for different screen sizes
  const mobileUrl = imagekitLoader({
    src,
    transformations: {
      width: mobileWidth,
      height: mobileWidth,
      crop: "maintain_ratio",
      quality: mobileQuality,
      format: "auto",
      progressive: true,
      ...transformations,
    },
  });

  const tabletUrl = imagekitLoader({
    src,
    transformations: {
      width: tabletWidth,
      height: tabletWidth,
      crop: "maintain_ratio",
      quality: Math.round((mobileQuality + desktopQuality) / 2), // Average quality
      format: "auto",
      progressive: true,
      ...transformations,
    },
  });

  const desktopUrl = imagekitLoader({
    src,
    transformations: {
      width: desktopWidth,
      height: desktopWidth,
      crop: "maintain_ratio",
      quality: desktopQuality,
      format: "auto",
      progressive: true,
      ...transformations,
    },
  });

  return (
    <Image
      src={desktopUrl} // Fallback for non-responsive browsers
      alt={alt}
      width={desktopWidth}
      height={desktopWidth}
      placeholder="blur"
      blurDataURL={blurDataURL}
      className={`${className} ${
        objectFit === "contain" ? "object-contain" : "object-cover"
      }`}
      priority={priority}
      sizes="(max-width: 640px) 400px, (max-width: 1024px) 600px, 800px"
      loader={({ width: requestedWidth }) => {
        if (requestedWidth <= 640) return mobileUrl;
        if (requestedWidth <= 1024) return tabletUrl;
        return desktopUrl;
      }}
    />
  );
}

/**
 * Fill Layout Responsive Image
 * For use with position: relative parent
 */
export function ResponsiveImageFill({
  src,
  alt,
  className,
  priority = false,
  mobileWidth = 400,
  tabletWidth = 600,
  desktopWidth = 1200,
  mobileQuality = 75,
  desktopQuality = 90,
  transformations = {},
  objectFit = "contain",
}: ResponsiveImageProps) {
  const blurDataURL = imagekitLoader({
    src,
    transformations: { width: 10, height: 10, blur: 80, quality: 5 },
  });

  return (
    <Image
      loader={({ width }) => {
        let targetWidth = desktopWidth;
        let quality = desktopQuality;
        if (width <= 640) {
          targetWidth = mobileWidth;
          quality = mobileQuality;
        } else if (width <= 1024) {
          targetWidth = tabletWidth;
          quality = Math.round((mobileQuality + desktopQuality) / 2);
        }

        return imagekitLoader({
          src,
          transformations: {
            width: targetWidth,
            height: targetWidth,
            crop: "maintain_ratio",
            quality,
            format: "auto",
            progressive: true,
            ...transformations,
          },
        });
      }}
      src={src}
      alt={alt}
      fill
      placeholder="blur"
      blurDataURL={blurDataURL}
      className={`${className} ${
        objectFit === "contain" ? "object-contain" : "object-cover"
      }`}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
    />
  );
}

/**
 * Product Card - Mobile Optimized
 * Serves 320px on mobile, 500px on desktop
 */
export function ProductCardMobile({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative aspect-square overflow-hidden ${className}`}>
      <ResponsiveImageFill
        src={src}
        alt={alt}
        mobileWidth={320}
        tabletWidth={500}
        desktopWidth={600}
        mobileQuality={75}
        desktopQuality={90}
        objectFit="contain"
        priority={priority}
      />
    </div>
  );
}

export function ProductGridMobile({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-lg ${className}`}
    >
      <ResponsiveImageFill
        src={src}
        alt={alt}
        mobileWidth={280} // Very small for mobile grids
        tabletWidth={400}
        desktopWidth={500}
        mobileQuality={70} // Aggressive compression
        desktopQuality={85}
        objectFit="contain"
      />
    </div>
  );
}

export function ProductHeroMobile({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full h-[400px] md:h-[600px] overflow-hidden ${className}`}
    >
      <ResponsiveImageFill
        src={src}
        alt={alt}
        mobileWidth={640} // Full mobile width
        tabletWidth={1024}
        desktopWidth={1920}
        mobileQuality={80}
        desktopQuality={95}
        objectFit="cover"
        priority
        transformations={{
          sharpen: 2,
        }}
      />
    </div>
  );
}

export function ProductThumbnailMobile({
  src,
  alt,
  size = 80,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const blurDataURL = imagekitLoader({
    src,
    transformations: { width: 10, height: 10, blur: 100, quality: 5 },
  });

  return (
    <Image
      loader={() =>
        imagekitLoader({
          src,
          transformations: {
            width: size,
            height: size,
            crop: "force",
            quality: 70, // Aggressive compression
            format: "auto",
          },
        })
      }
      src={src}
      alt={alt}
      width={size}
      height={size}
      placeholder="blur"
      blurDataURL={blurDataURL}
      className={`${className} object-cover rounded`}
    />
  );
}

export function ProductGalleryMobile({
  images,
  className,
}: {
  images: Array<{ src: string; alt: string }>;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-xl"
        >
          <ResponsiveImageFill
            src={image.src}
            alt={image.alt}
            mobileWidth={640} // Full mobile width
            tabletWidth={800}
            desktopWidth={1200} // High res on desktop
            mobileQuality={85}
            desktopQuality={95}
            priority={index === 0} // Prioritize first image
            transformations={{
              sharpen: index === 0 ? 3 : 1, // Sharpen main image
            }}
          />
        </div>
      ))}
    </div>
  );
}
