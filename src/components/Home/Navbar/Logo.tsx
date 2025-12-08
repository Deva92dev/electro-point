import Link from "next/link";
import { Zap } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative w-8 h-8 bg-foreground rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.5)]">
        <Zap className="w-5 h-5 text-background fill-current" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-black text-xl tracking-tighter text-foreground">
          ELECTRO
          <span className="text-primary">POINT</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
