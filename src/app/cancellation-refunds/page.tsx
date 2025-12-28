import PageHeader from "@/components/global/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refunds | ElectroPoint",
};

export default function CancellationPage() {
  return (
    <main className="bg-background min-h-screen pb-20">
      <PageHeader title="Cancellation & Refund Policy" />

      <section className="max-w-3xl mx-auto px-4 mt-12 space-y-8 text-foreground">
        <div className="p-6 rounded-lg border border-border bg-muted/30">
          <h3 className="font-semibold text-lg mb-2">Quick Summary</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>30-day return window for unopened items.</li>
            <li>Restocking fee applies to opened electronics.</li>
            <li>Refunds processed within 5-7 business days.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Order Cancellation</h2>
          <p className="text-muted-foreground">
            You may cancel your order within <strong>2 hours</strong> of
            placement directly from your account dashboard. After this window,
            the order is sent to our warehouse for processing and cannot be
            cancelled instantly. Please contact support if you missed this
            window.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">2. Returns & Refunds</h2>
          <p className="text-muted-foreground">
            We accept returns on all hardware within 30 days of delivery. Items
            must be in their original condition with all accessories included.
            <br />
            <br />
            <strong>Defective Items:</strong> If your product arrives defective,
            we will provide a prepaid shipping label for a full refund or
            exchange immediately.
          </p>
        </div>
      </section>
    </main>
  );
}
