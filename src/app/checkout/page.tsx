"use client";

import { useState } from "react";
import ShippingForm from "@/components/checkout/ShippingForm";
import StripeWrapper from "@/components/checkout/StripeWrapper";
import { m, AnimatePresence } from "@/components/motion";

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  return (
    <main className="min-h-screen pt-24 pb-20 bg-muted/30">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">
          Checkout
        </h1>

        <div className="bg-background border border-border rounded-2xl shadow-sm p-6 md:p-8">
          <AnimatePresence mode="wait">
            {!clientSecret ? (
              <m.div
                key="shipping"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-xl font-semibold mb-6">
                  1. Shipping Details
                </h2>
                {/* The Form calls createPaymentSession internally and returns the secret */}
                <ShippingForm onSessionCreated={setClientSecret} />
              </m.div>
            ) : (
              <m.div
                key="payment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">2. Payment</h2>
                  <button
                    onClick={() => setClientSecret(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit Address
                  </button>
                </div>
                <StripeWrapper clientSecret={clientSecret} />
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
