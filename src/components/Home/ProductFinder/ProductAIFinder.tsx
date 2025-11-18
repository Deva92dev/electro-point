"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { category, FilteredProductsType } from "@/utils/types";
import { getFilteredProducts } from "@/utils/actions";
import ProductFinderModal from "./ProductFinderModal";

interface Props {
  categories: category[];
}

const QUIZ_STEPS = 3;
const MIN_BUDGET = 10000;
const MAX_BUDGET = 1000000;

const ProductAIFinder = ({ categories }: Props) => {
  const [step, setStep] = useState(1);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
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

    startTransition(async () => {
      try {
        const filters = {
          categoryName: selectedCategoryName,
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
      <section className="flex flex-col w-full max-w-md backdrop-blur-sm bg-primary/10 border border-primary/20 rounded-3xl shadow-2xl p-8">
        {/* Progress Dots */}
        <div className="flex justify-center mb-6 gap-3">
          {[...Array(QUIZ_STEPS)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                step === i + 1 ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        {/* step content */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              What are you looking for today?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategoryName(cat.productType)}
                  className={`flex flex-col cursor-pointer transition duration-300 ${
                    selectedCategoryName === cat.productType
                      ? "border-primary bg-primary/30 scale-105"
                      : "border-transparent"
                  }`}
                >
                  <span className="">{cat.productType}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              What is your budget Range?
            </h2>
            <Input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step={10000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm px-2">
              <span>₹{MIN_BUDGET.toLocaleString()}</span>
              <span>₹{maxBudget.toLocaleString()}</span>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">What matters most</h2>
            <div className="flex flex-wrap gap-3">
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
                  className={`flex flex-col cursor-pointer transition duration-300 ${
                    priority === p
                      ? "border-primary bg-primary/30 scale-105"
                      : "border-transparent"
                  }`}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* controls */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevQuiz}
            disabled={step === 1 || isPending}
            variant="outline"
            className="bg-muted/70 disabled:opacity-40 rounded-md"
          >
            Previous
          </Button>
          {step < QUIZ_STEPS ? (
            <Button
              onClick={nextQuiz}
              disabled={
                (step === 1 && !selectedCategoryName) ||
                (step === 3 && !priority)
              }
              className="bg-primary disabled:opacity-40 rounded-md"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleShowMatches}
              disabled={isPending || !priority}
              className="bg-primary rounded-md"
            >
              {isPending ? "Finding..." : `Show Matches`}
            </Button>
          )}
        </div>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
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
