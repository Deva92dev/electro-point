import PageHeader from "@/components/global/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ElectroPoint",
};

export default function PrivacyPage() {
  return (
    <main className="bg-background min-h-screen pb-20">
      <PageHeader title="Privacy Policy" />

      <section className="max-w-3xl mx-auto px-4 mt-12 space-y-8 text-foreground">
        <p className="text-sm text-muted-foreground">
          Last Updated: December 2025
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or sign up for our newsletter.
            This includes your name, email address, shipping address, and
            payment information.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">2. How We Use Data</h2>
          <p className="text-muted-foreground">We use your data to:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
            <li>Process and deliver your orders.</li>
            <li>Send order confirmations and invoices.</li>
            <li>Detect and prevent fraud.</li>
            <li>Improve our store personalization.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">3. Data Security</h2>
          <p className="text-muted-foreground">
            We implement industry-standard encryption (SSL) and secure payment
            gateways. We do not store your full credit card numbers on our
            servers.
          </p>
        </div>
      </section>
    </main>
  );
}
