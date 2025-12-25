"use client";

import { Button } from "@/components/ui/button";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/sucess`,
        },
      });

      if (error) {
        console.error("🔴 Stripe Error:", error.message);
        alert(`Payment Error: ${error.message}`);
      }
    } catch (err) {
      console.error("🔴 Unexpected Error:", err);
      alert("Unexpected Error Check Console");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border-4 rounded-xl">
      <PaymentElement options={{ layout: "tabs" }} />
      <Button type="submit" className="w-full h-12 text-lg font-bold">
        Pay Here
      </Button>
    </form>
  );
};

export default CheckoutForm;
