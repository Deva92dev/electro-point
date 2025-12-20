"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, FilteredProductsType } from "@/utils/types";
import ProductFinderModal from "./ProductFinderModal";
import { getFilteredProducts } from "@/utils/actions/mutations";

interface Props {
  categories: Category[];
}
// this imports "use cache directive"
const QUIZ_STEPS = 3;
const MIN_BUDGET = 10000;
const MAX_BUDGET = 1000000;

const ProductAIFinder = ({ categories }: Props) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<
    Category["productType"] | null
  >(null);
  const [maxBudget, setMaxBudget] = useState<number>(500000);
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
      <section
        className="relative flex flex-col w-full max-w-none lg:max-w-md overflow-hidden rounded-4xl shadow-2xl border bg-zinc-900 border-black/10 mask-box"
        style={{
          // the glassmorphism + noise texture effect
          background: `
            linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01)),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")
          `,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Content Container */}
        <div className="p-6 md:p-8 lg:p-10 relative z-10">
          {/* Progress Dots */}
          <div className="flex justify-center mb-8 gap-3">
            {[...Array(QUIZ_STEPS)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  step === i + 1 ? "w-8 bg-primary" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px] flex flex-col">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-foreground/90">
                  What are you looking for?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      onClick={() => setSelectedType(cat.productType)}
                      variant="outline"
                      className={`h-auto py-4 flex flex-col gap-2 border transition-all duration-200 ${
                        selectedType === cat.productType
                          ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                          : "border-gray-700/5 bg-white/5 hover:bg-white/10 hover:border-gray-700/20 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="capitalize text-base font-medium">
                        {`${cat.productType}s`}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-foreground/90">
                  What is your budget?
                </h2>
                <div className="px-4 pt-8 space-y-8">
                  <Input
                    type="range"
                    min={MIN_BUDGET}
                    max={MAX_BUDGET}
                    step={10000}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        Min
                      </span>
                      <span className="font-mono">
                        ₹{MIN_BUDGET.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col text-right">
                      <span className="text-xs text-primary uppercase tracking-wider">
                        Max
                      </span>
                      <span className="font-mono text-xl text-primary font-bold">
                        ₹{maxBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-foreground/90">
                  Top Priority?
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    "Performance",
                    "Battery Life",
                    "Design",
                    "Camera",
                    "Gaming",
                  ].map((p) => (
                    <Button
                      key={p}
                      onClick={() => setPriority(p)}
                      variant="outline"
                      className={`rounded-full px-6 py-2 border transition-all duration-200 ${
                        priority === p
                          ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                          : "border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Controls */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              onClick={prevQuiz}
              disabled={step === 1 || isPending}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              Back
            </Button>

            {step < QUIZ_STEPS ? (
              <Button
                onClick={nextQuiz}
                disabled={
                  (step === 1 && !selectedType) || (step === 3 && !priority)
                }
                className="px-8 font-semibold shadow-lg shadow-primary/20"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleShowMatches}
                disabled={isPending || !priority}
                className="px-8 font-bold bg-primary hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)]"
              >
                {isPending ? "Searching..." : "Find Matches"}
              </Button>
            )}
          </div>

          {errorMessage && (
            <p className="text-destructive text-sm text-center mt-4 animate-pulse">
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
