"use client";

import { ComparisonProduct } from "@/utils/types";
import { ArrowRight, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  products: ComparisonProduct[];
}

type SpecValue = string | number | boolean | undefined;

// fix this
const SPEC_ORDER = [
  { key: "processor", label: "Chipset", isNumeric: false },
  { key: "ram", label: "RAM", isNumeric: true, unit: "GB" },
  { key: "storage", label: "Base Storage", isNumeric: true, unit: "GB" },
  { key: "camera", label: "Main Camera", isNumeric: true, unit: "MP" },
  { key: "battery", label: "Battery", isNumeric: true, unit: "mAh" },
  { key: "screen", label: "Display", isNumeric: false },
  { key: "refreshRate", label: "Refresh Rate", isNumeric: true, unit: "Hz" },
];

// Helper to extract numbers from strings (e.g. "12GB" -> 12)
const extractNumber = (val: SpecValue): number => {
  if (val === undefined || val === null) return 0;
  if (typeof val === "boolean") return val ? 1 : 0; // Handle boolean if erroneously marked numeric
  if (typeof val === "number") return val;
  // Safe string regex match
  const match = String(val).match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
};

// Compares two values and renders a progress bar
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
  const max = Math.max(val1, val2) || 1; // Avoid divide by zero

  // Calculate percentages
  const pct1 = Math.round((val1 / max) * 100);
  const pct2 = Math.round((val2 / max) * 100);

  return (
    <div className="flex flex-col gap-1 mt-2 w-full">
      {/* Active Product Bar */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${pct1}%` }}
          />
        </div>
      </div>
      {/* Rival Product Bar Faded */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/30 transition-all duration-500 ease-out"
            style={{ width: `${pct2}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const AnimatedText = ({ value }: { value: string | undefined }) => {
  return (
    <span
      className="block animate-in slide-in-from-bottom-2 fade-in duration-300"
      key={value}
    >
      {value || "N/A"}
    </span>
  );
};

const SpecWarsClient = ({ products }: Props) => {
  if (products.length < 2) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];
  const compareProduct = products[activeIndex === 0 ? 1 : 0];

  if (!activeProduct || !compareProduct) return null;

  return (
    <div className="w-full flex flex-col lg:flex-row bg-zinc-950 rounded-xl shadow-2xl overflow-hidden border border-white/10 text-white">
      {/* LEFT SIDE: Controls (Sticky) */}
      <div className="lg:w-2/5 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 lg:h-auto flex flex-col justify-between">
        <div>
          <h2 className="mb-2 text-indigo-400 font-medium tracking-wide uppercase text-xs">
            The Spec Wars
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-6 text-white">
            Compare <br /> The Titans.
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Select a flagship to see how it stacks up against the competition in
            raw performance metrics.
          </p>
        </div>

        <div className="mt-12">
          {/* Toggle Switch */}
          <div className="flex flex-col gap-3">
            {products.map((prod, index) => (
              <button
                key={prod.id}
                onClick={() => setActiveIndex(index)}
                className={`relative w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 group ${
                  activeIndex === index
                    ? "bg-white/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                    : "bg-transparent border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black">
                  <Image
                    src={prod.mainImagePath}
                    alt={prod.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="text-left">
                  <span
                    className={`block text-sm font-bold ${
                      activeIndex === index ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {prod.name}
                  </span>
                  {activeIndex === index && (
                    <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">
                      Currently Selected
                    </span>
                  )}
                </div>
                {activeIndex === index && (
                  <Check className="ml-auto w-5 h-5 text-indigo-400" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-zinc-500">
              Viewing {activeProduct.name}
            </span>
            <Link
              href={`/products/${activeProduct.id}`}
              className="text-xs font-bold text-white flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              Full Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Data Grid */}
      <div className="lg:w-3/5 bg-zinc-950">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/10 bg-zinc-900/50 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <div className="col-span-4">Feature</div>
          <div className="col-span-8 flex justify-between px-2">
            <span>{activeProduct.name.split(" ")[0]} (Active)</span>
            <span>VS Rival</span>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/5">
          {SPEC_ORDER.map((spec, idx) => {
            const rawV1 = activeProduct.quickSpecs?.[spec.key];
            const rawV2 = compareProduct.quickSpecs?.[spec.key];

            const v1 = rawV1 !== undefined ? String(rawV1) : undefined;
            const v2 = rawV2 !== undefined ? String(rawV2) : undefined;

            return (
              <div
                key={spec.key}
                // FIX 3: Alternating backgrounds for readability
                className={`grid grid-cols-12 gap-4 px-8 py-6 items-center transition-colors hover:bg-white/2 ${
                  idx % 2 === 0 ? "bg-transparent" : "bg-white/2"
                }`}
              >
                {/* Label */}
                <div className="col-span-4 text-sm font-medium text-zinc-400">
                  {spec.label}
                </div>

                {/* Comparison Logic */}
                <div className="col-span-8">
                  <div className="flex justify-between items-center mb-1">
                    {/* Active Value (Big, White) */}
                    <span className="text-lg font-bold text-white">
                      <AnimatedText value={v1} />
                    </span>
                    <span className="text-sm font-mono text-zinc-600">
                      {v2 || "—"}
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

        <div className="p-8 text-center">
          <p className="text-xs text-zinc-700">
            *Data automatically aggregated from manufacturer specifications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpecWarsClient;
