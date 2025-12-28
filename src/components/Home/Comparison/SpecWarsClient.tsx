"use client";

import { ComparisonProduct } from "@/utils/types";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  products: ComparisonProduct[];
}

type SpecValue = string | number | boolean | undefined;

const SPEC_ORDER = [
  { key: "processor", label: "Chipset", isNumeric: false },
  { key: "ram", label: "RAM", isNumeric: true, unit: "GB" },
  { key: "storage", label: "Base Storage", isNumeric: true, unit: "GB" },
  { key: "camera", label: "Main Camera", isNumeric: true, unit: "MP" },
  { key: "battery", label: "Battery", isNumeric: true, unit: "mAh" },
  { key: "screen", label: "Display", isNumeric: false },
  { key: "refreshRate", label: "Refresh Rate", isNumeric: true, unit: "Hz" },
];

// Helper to extract numbers
const extractNumber = (val: SpecValue): number => {
  if (val === undefined || val === null) return 0;
  if (typeof val === "boolean") return val ? 1 : 0;
  if (typeof val === "number") return val;
  const match = String(val).match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
};

// Formats value with unit (e.g. 120 -> 120Hz)
const formatValue = (val: SpecValue, unit?: string) => {
  if (!val) return "Standard"; // Fallback instead of "N/A"
  if (String(val).toLowerCase() === "n/a") return "Standard";
  return unit ? `${val} ${unit}` : String(val);
};

// Progress Bar Component
const ComparisonBar = ({
  activeValue,
  rivalValue,
  isNumeric,
}: {
  activeValue: SpecValue;
  rivalValue: SpecValue;
  isNumeric: boolean;
}) => {
  if (!isNumeric) return null;

  const val1 = extractNumber(activeValue);
  const val2 = extractNumber(rivalValue);

  // If no valid numbers, hide bar
  if (val1 === 0 && val2 === 0) return null;

  const max = Math.max(val1, val2) || 1;
  const pct1 = Math.round((val1 / max) * 100);
  const pct2 = Math.round((val2 / max) * 100);

  return (
    <div className="flex flex-col gap-1.5 mt-3 w-full">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-400 transition-all duration-1000 ease-out"
            style={{ width: `${pct1}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/30 transition-all duration-1000 ease-out"
            style={{ width: `${pct2}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const SpecWarsClient = ({ products }: Props) => {
  if (products.length < 2) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];
  const compareProduct = products[activeIndex === 0 ? 1 : 0];

  if (!activeProduct || !compareProduct) return null;

  return (
    <div className="w-full flex flex-col lg:flex-row bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden border border-white/10 text-white">
      {/* LEFT SIDE: Controls */}
      <div className="lg:w-2/5 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 bg-zinc-900/50 backdrop-blur-md relative flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-indigo-300 font-medium tracking-wide uppercase text-xs">
              The Spec Wars
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4 text-white leading-tight">
              Compare <br /> The Titans.
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Select a flagship to see how it stacks up against the competition
              in raw performance.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            {products.map((prod, index) => (
              <button
                key={prod.id}
                onClick={() => setActiveIndex(index)}
                className={`relative w-full flex items-center gap-5 p-4 rounded-xl border transition-all duration-300 group ${
                  activeIndex === index
                    ? "bg-white/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                    : "bg-transparent border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                  <Image
                    src={prod.mainImagePath}
                    alt={`${prod.name} thumbnail`}
                    fill
                    sizes="64px"
                    loading="lazy"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <span
                    className={`block text-base font-bold truncate ${
                      activeIndex === index
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-zinc-300"
                    }`}
                  >
                    {prod.name}
                  </span>
                  {activeIndex === index && (
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mt-1 block">
                      Active Selection
                    </span>
                  )}
                </div>
                {activeIndex === index && (
                  <div className="bg-indigo-500/20 p-1.5 rounded-full">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-zinc-400 font-medium truncate max-w-[150px]">
            {activeProduct.name}
          </span>
          <Link
            href={`/products/${activeProduct.id}`}
            className="text-xs font-bold text-white flex items-center gap-2 hover:text-indigo-300 transition-colors shrink-0 group"
          >
            Full Details
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: Data Grid */}
      <div className="lg:w-3/5 bg-zinc-950 flex flex-col">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-6 px-8 py-5 border-b border-white/10 bg-zinc-900/50 text-xs font-bold uppercase tracking-wider text-zinc-400 sticky top-0 z-10">
          <div className="col-span-4">Feature</div>
          <div className="col-span-8 flex justify-between px-2">
            <span>Current</span>
            <span>Rival</span>
          </div>
        </div>

        {/* Scrollable specs area if needed, otherwise auto height */}
        <div className="divide-y divide-white/5">
          {SPEC_ORDER.map((spec, idx) => {
            const rawV1 = activeProduct.quickSpecs?.[spec.key];
            const rawV2 = compareProduct.quickSpecs?.[spec.key];

            if (!rawV1 && !rawV2) return null;

            return (
              <div
                key={spec.key}
                className={`grid grid-cols-12 gap-6 px-8 py-6 items-center transition-colors hover:bg-white/5 ${
                  idx % 2 !== 0 ? "bg-white/2" : "bg-transparent"
                }`}
              >
                <div className="col-span-4 text-sm font-medium text-zinc-300">
                  {spec.label}
                </div>

                <div className="col-span-8">
                  <div className="flex justify-between items-baseline mb-2">
                    {/* Active Value */}
                    <span className="text-lg md:text-xl font-bold text-white">
                      {formatValue(rawV1, spec.unit)}
                    </span>
                    {/* Rival Value */}
                    <span className="text-sm font-mono text-zinc-400">
                      {formatValue(rawV2, spec.unit)}
                    </span>
                  </div>

                  {spec.isNumeric && (
                    <ComparisonBar
                      activeValue={rawV1}
                      rivalValue={rawV2}
                      isNumeric={spec.isNumeric}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Disclaimer */}
        <div className="p-8 text-center border-t border-white/5 mt-auto">
          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest opacity-80">
            * Live Comparison based on technical specifications
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpecWarsClient;
