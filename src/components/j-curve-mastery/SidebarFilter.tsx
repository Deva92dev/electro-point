"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  allColors: string[];
}

const SidebarFilter = ({ allColors }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams);
    console.log(params.get("color"));
    const current = params.get("color");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {allColors.map((c, index: number) => (
        <div>
          <Checkbox
            key={index}
            checked={searchParams.has("color")}
            onClick={handleToggle}
          />
          <label htmlFor="">{c}</label>
        </div>
      ))}
    </div>
  );
};

export default SidebarFilter;
