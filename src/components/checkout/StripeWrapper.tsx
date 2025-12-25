"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import CheckoutForm from "./CheckoutForm";

// DEBUG: Check if the key exists
const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
console.log(
  "Stripe Key Loaded:",
  key
    ? "YES (Starts with " + key.substring(0, 5) + ")"
    : "NO - KEY IS UNDEFINED"
);

if (!key) {
  throw new Error("Stripe Key is missing in .env");
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

interface Props {
  clientSecret: string;
}

const StripeWrapper = ({ clientSecret }: Props) => {
  const { theme } = useTheme();

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: theme === "dark" ? ("night" as const) : ("stripe" as const),
        variables: {
          colorPrimary: "#0f172a",
          borderRadius: "0.5rem",
          fontFamily: "var(--font-sans)",
        },
      },
    }),
    [clientSecret, theme]
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeWrapper;
