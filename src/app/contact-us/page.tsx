import PageHeader from "@/components/global/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ElectroPoint",
  description:
    "Get in touch with our support team for any queries or assistance.",
};

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen pb-20">
      <PageHeader
        title="Contact Us"
        subtitle="We're here to help. Reach out to us for any queries."
      />

      <section className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 text-foreground">
        {/* LEFT COLUMN: Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Get in Touch
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Have a question about a product, your order, or just want to say
              hello? Fill out the form and our team will get back to you within
              24 hours.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-muted rounded-full">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Headquarters</h3>
                <p className="text-muted-foreground">
                  123 Tech Park, Cyber City
                  <br />
                  Gurugram, Haryana 122002, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-muted rounded-full">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-muted-foreground">+91 98765 43210</p>
                <p className="text-xs text-muted-foreground">
                  Mon-Fri, 9am - 6pm IST
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-muted rounded-full">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-muted-foreground">
                  support@electropoint.com
                </p>
                <p className="text-muted-foreground">sales@electropoint.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="bg-muted/30 p-8 rounded-2xl border border-border">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Order #12345"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="How can we help you today?"
                className="bg-background min-h-[150px] resize-none"
              />
            </div>

            <Button size="lg" className="w-full font-bold">
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
