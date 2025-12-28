import Auth from "@/assets/Auth.webp";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
  title: string;
  subTitle: string;
}

const AuthLayout = ({ children, subTitle, title }: Props) => {
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* LEFT: Form Section */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{subTitle}</p>
          </div>

          {/* The Form Content */}
          {children}
        </div>
      </div>

      {/* RIGHT: Visual Section (Hidden on Mobile) */}
      <div className="hidden lg:block relative bg-zinc-900 overflow-hidden">
        <Image
          src={Auth}
          alt="Auth Background"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-60"
          preload={true}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
        {/* Testimonial / Brand Text */}
        <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
          <blockquote className="text-2xl font-medium leading-relaxed">
            &ldquo;The best tech purchasing experience I've ever had. Fast,
            reliable, and premium.&rdquo;
          </blockquote>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <div className="w-6 h-6 rounded-full bg-white/20" />
            <span>Alex Chen, Product Designer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
