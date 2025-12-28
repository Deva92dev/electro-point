import Image from "next/image";
import HeroImage from "@/assets/Hero.webp";

interface Props {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src={HeroImage}
          alt="Header Background"
          fill
          sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw"
          preload={true}
          placeholder="blur"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 capitalize">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
