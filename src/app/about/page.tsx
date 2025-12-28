import PageHeader from "@/components/global/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | ElectroPoint",
  description:
    "Learn about our mission to bring premium electronics to creators.",
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen pb-20">
      <PageHeader
        title="About ElectroPoint"
        subtitle="Bridging the gap between modern creators and premium technology."
      />

      <section className="max-w-4xl mx-auto px-4 mt-12 space-y-12 text-foreground">
        {/* Mission */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            At ElectroPoint, we believe technology is more than just specs and
            circuits—it's the tool that unlocks human potential. Our mission is
            to curate the world's finest electronics, ensuring that developers,
            designers, and creators have the hardware they need to build the
            future.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border">
          {[
            { label: "Products", value: "5,000+" },
            { label: "Happy Clients", value: "10k+" },
            { label: "Years", value: "12" },
            { label: "Support", value: "24/7" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">The Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Founded in 2012, we started as a small garage operation fixing
            custom PC rigs. Today, we stand as a premier destination for
            high-end electronics. We don't just sell boxes; we verify, test, and
            recommend every product in our catalog to ensure it meets the
            rigorous demands of professional workflows.
          </p>
        </div>
      </section>
    </main>
  );
}
