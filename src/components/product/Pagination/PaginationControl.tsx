"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
}

const PaginationControl = ({ currentPage, totalPages }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages < 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="left-button"
      >
        <ChevronLeftCircle className="w-4 h-4 cursor-pointer" />
      </Button>
      <span className="text-sm font-medium px-4">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="right-button"
      >
        <ChevronRightCircle className="w-4 h-4 cursor-pointer" />
      </Button>
    </div>
  );
};

export default PaginationControl;
