"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  allColors: string[];
}

const SidebarFilter = ({ allColors }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  const current = params.get("color");

  // for multiple colors do this
  const handleToggle = (color: string) => {
    const value = current ? current.split(",").map((cat) => cat.trim()) : [];
    const isClicked = value.includes(color);

    let newValue;
    if (isClicked) {
      newValue = value.filter((c) => c != color);
    } else {
      newValue = [...value, color];
    }
    if (newValue.length === 0) {
      params.delete("color");
    } else {
      params.set("color", newValue.join(","));
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {allColors.map((c, index: number) => (
        <div key={index}>
          <Checkbox
            key={index}
            onClick={() => handleToggle(c)}
            checked={current?.includes(c)}
          />
          <label htmlFor="">{c}</label>
        </div>
      ))}
    </div>
  );
};

export default SidebarFilter;
