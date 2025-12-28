import PageHeader from "@/components/global/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | ElectroPoint",
};

export default function TermsPage() {
  return (
    <main className="bg-background min-h-screen pb-20">
      <PageHeader title="Terms & Conditions" />

      <section className="max-w-3xl mx-auto px-4 mt-12 space-y-8 text-foreground">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground">
            These Terms and Conditions govern your use of the ElectroPoint
            website. By accessing this website, you agree to accept these terms
            in full. Do not use this website if you disagree with any part of
            these terms.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">2. Intellectual Property</h2>
          <p className="text-muted-foreground">
            Unless otherwise stated, ElectroPoint and/or its licensors own the
            intellectual property rights for all material on ElectroPoint. All
            intellectual property rights are reserved.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">3. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            In no event shall ElectroPoint, nor any of its officers, directors,
            and employees, be held liable for anything arising out of or in any
            way connected with your use of this website.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">4. Governing Law</h2>
          <p className="text-muted-foreground">
            These terms will be governed by and interpreted in accordance with
            the laws of the jurisdiction of India, and you submit to the
            non-exclusive jurisdiction of the state and federal courts located
            in India for the resolution of any disputes.
          </p>
        </div>
      </section>
    </main>
  );
}
