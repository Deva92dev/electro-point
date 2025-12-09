"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  allColors: string[];
}

const SidebarFilter = ({ allColors }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleToggle = (color: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("color") as string;
    if (color) {
      params.set(current, "color");
    } else {
      params.delete(color);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {allColors.map((c, index: number) => (
        <div>
          <Checkbox key={index} onClick={() => handleToggle(c)} />
          <label htmlFor="">{c}</label>
        </div>
      ))}
    </div>
  );
};

export default SidebarFilter;
