"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const SortDropDown = ({ activeSort }: { activeSort?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground hidden sm:inline-block">
        Sort by:
      </span>
      <Select defaultValue={activeSort || "newest"} onValueChange={handleSort}>
        <SelectTrigger className="w-[180px] h-10 bg-background">
          <SelectValue placeholder="Newest Arrival" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest Arrival</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="a-z">A to Z</SelectItem>
          <SelectItem value="z-a">Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortDropDown;
