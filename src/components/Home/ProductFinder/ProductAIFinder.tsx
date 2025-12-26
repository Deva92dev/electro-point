"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, FilteredProductsType } from "@/utils/types";
import ProductFinderModal from "./ProductFinderModal";
import { getFilteredProducts } from "@/utils/actions/mutations";
import { formatPrice } from "@/utils/util";
import { ArrowRight, Search, Sparkles, Loader2 } from "lucide-react";

interface Props {
  categories: Category[];
}

const QUIZ_STEPS = 3;
const MIN_BUDGET = 20;
const MAX_BUDGET = 5000;

const ProductAIFinder = ({ categories }: Props) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<
    Category["productType"] | null
  >(null);
  const [maxBudget, setMaxBudget] = useState<number>(2000);
  const [priority, setPriority] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<FilteredProductsType>([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const nextQuiz = () => {
    if (step < QUIZ_STEPS) setStep(step + 1);
  };

  const prevQuiz = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleShowMatches = () => {
    setErrorMessage(null);
    setShowModal(true);

    startTransition(async () => {
      try {
        const filters = {
          productType: selectedType,
          maxBudget: maxBudget,
          priority: priority,
        };
        const newResult = await getFilteredProducts(filters);
        setResult(newResult);
      } catch (error) {
        console.error("[CLIENT] FAILED TO FETCH PRODUCTS:", error);
        setErrorMessage("A server error occurred. Failed to find products.");
      }
    });
  };

  return (
    <>
      <section className="relative flex flex-col w-full h-full min-h-[500px] overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2a2a2a_0%,#000000_100%)] z-0" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 blur-[120px] rounded-full z-0 opacity-40 pointer-events-none" />

        {/* Content Container */}
        <div className="p-8 md:p-10 flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
                AI Assistant
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              What are you <br /> looking for?
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${(step / QUIZ_STEPS) * 100}%` }}
            />
          </div>

          {/* Step Content Area - Grows to fill space */}
          <div className="flex-1 flex flex-col justify-center">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">
                  Select Category
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedType(cat.productType)}
                      className={`group relative p-4 rounded-xl border text-left transition-all duration-300 ${
                        selectedType === cat.productType
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <span
                        className={`block text-sm font-bold capitalize ${
                          selectedType === cat.productType
                            ? "text-primary"
                            : "text-zinc-300 group-hover:text-white"
                        }`}
                      >
                        {cat.productType}s
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                  Set Your Budget
                </p>

                <div className="px-2 pt-4">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-4xl font-bold text-white tracking-tighter">
                      {formatPrice(maxBudget)}
                    </span>
                    <span className="text-xs text-zinc-500 mb-2">
                      Max Limit
                    </span>
                  </div>

                  <Input
                    type="range"
                    min={MIN_BUDGET}
                    max={MAX_BUDGET}
                    step={50}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-2 text-xs text-zinc-500 font-mono">
                    <span>{formatPrice(MIN_BUDGET)}</span>
                    <span>{formatPrice(MAX_BUDGET)}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                  Top Priority
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Performance",
                    "Battery Life",
                    "Design",
                    "Camera",
                    "Gaming",
                  ].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                        priority === p
                          ? "border-primary bg-primary text-white shadow-lg scale-105"
                          : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <Button
              onClick={prevQuiz}
              disabled={step === 1 || isPending}
              variant="ghost"
              className="text-zinc-400 hover:text-white hover:bg-white/5 pl-0 transition-colors"
            >
              Back
            </Button>

            {step < QUIZ_STEPS ? (
              <Button
                onClick={nextQuiz}
                disabled={
                  (step === 1 && !selectedType) || (step === 3 && !priority)
                }
                className="rounded-full px-6 bg-white text-black hover:bg-zinc-200 font-bold transition-transform active:scale-95"
              >
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleShowMatches}
                disabled={isPending || !priority}
                className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-all hover:scale-105 disabled:opacity-70 disabled:scale-100"
              >
                {isPending ? (
                  <>
                    Analyzing <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    Find Matches <Search className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-400 text-xs text-center mt-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20">
              {errorMessage}
            </p>
          )}
        </div>
      </section>

      <ProductFinderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isLoading={isPending}
        results={result}
        priority={priority}
        maxBudget={maxBudget}
      />
    </>
  );
};

export default ProductAIFinder;
