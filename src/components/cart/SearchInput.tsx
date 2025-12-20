"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onSearch: (value: string) => void;
  debounceTime?: number; // Optional: Useful if re-using for Server Search later
}

const SearchInput = ({
  placeholder = "Search...",
  className,
  onSearch,
  debounceTime = 0, // Default to instant for local search
}: SearchInputProps) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(value);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [value, debounceTime, onSearch]);

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 h-10 bg-muted/30 border-muted focus:bg-background transition-colors"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
