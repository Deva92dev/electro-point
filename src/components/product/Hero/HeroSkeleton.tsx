import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <div className="w-full h-[200px] md:h-[300px] bg-muted relative overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 px-4">
        <Skeleton className="h-8 md:h-12 w-1/2 max-w-lg bg-background/50" />
        <Skeleton className="h-4 md:h-6 w-1/3 max-w-md bg-background/50" />
      </div>
    </div>
  );
}
