import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        <div className="relative bg-muted/50 p-6 rounded-full border border-border">
          <SearchX className="w-16 h-16 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It might have
          been removed, renamed, or doesn't exist.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-10">
        <Button asChild variant="default" size="lg">
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/products" className="group">
            <MoveLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Browse Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
