"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
      <div className="mb-6 p-4 rounded-full bg-destructive/10 border border-destructive/20 text-destructive">
        <AlertCircle className="w-12 h-12" />
      </div>

      <div className="space-y-4 max-w-lg mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Something went wrong!
        </h1>
        <p className="text-muted-foreground">
          We apologize for the inconvenience. An unexpected error has occurred
          while processing your request.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-4 bg-muted rounded-md border border-border text-left overflow-auto max-h-32 text-xs font-mono text-destructive">
            {error.message || "Unknown Error"}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => reset()}
          variant="default"
          size="lg"
          className="gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
