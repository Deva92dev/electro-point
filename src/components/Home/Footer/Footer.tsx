import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Facebook, Instagram, Send, Twitter } from "lucide-react";
import Link from "next/link";

const FooterLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Flash Deals", href: "/products?tag=flash-deal" },
    { label: "Accessories", href: "/products?category=accessories" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Order Status", href: "/orders" },
    { label: "Returns & Warranty", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

const Footer = () => {
  return (
    <footer className="w-full bg-foreground text-background pt-12 pb-8 md:pt-24 md:pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* TOP HALF: Call to Adventure */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-24 space-y-6 md:space-y-8">
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter uppercase leading-[0.9]">
            Ready to <br />
            <span className="text-primary">Upgrade?</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-xl max-w-xs md:max-w-xl mx-auto">
            Experience the future of technology today. Join thousands of
            satisfied tech enthusiasts.
          </p>
          <Button
            size="lg"
            className="h-12 px-8 md:h-14 md:px-10 rounded-full text-base md:text-lg font-semibold bg-background text-foreground hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)]"
          >
            Shop Now <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>

        <div className="w-full h-px bg-white/10 mb-12 md:mb-16" />
        {/* BOTTOM HALF: Links & Newsletter */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-y-12 lg:gap-12">
          {/* BRAND */}
          <div className="col-span-1 md:col-span-6 lg:col-span-4 space-y-4 md:space-y-6 text-center md:text-left">
            <Link href="/" className="font-bold tracking-tight text-2xl">
              ElectroPoint
            </Link>
            <p className="text-muted-foreground max-w-xs mx-auto md:mx-0 text-sm md:text-base">
              Premium electronics curated for the modern creator. Quality,
              performance, and design in every pixel.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS GROUP */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2 space-y-4 text-center md:text-left">
            <h4 className="font-bold text-lg">Shop</h4>
            <ul className="space-y-2 text-sm md:text-base">
              {FooterLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3 lg:col-span-2 space-y-4 text-center md:text-left">
            <h4 className="font-bold text-lg">Support</h4>
            <ul className="space-y-2 text-sm md:text-base">
              {FooterLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="col-span-1 md:col-span-12 lg:col-span-4 space-y-6 pt-4 md:pt-0 text-center md:text-left">
            <div>
              <h4 className="font-bold text-lg mb-2">Stay in the Loop</h4>
              <p className="text-muted-foreground text-sm">
                Get early access to flash sales and new drops. No spam, ever.
              </p>
            </div>

            <form className="relative max-w-md mx-auto md:mx-0 md:max-w-lg lg:max-w-sm group">
              <Input
                type="email"
                placeholder="your@email.com"
                className="h-12 pr-12 rounded-full bg-white/10 border-white/20 text-white 
                  placeholder:text-white/40 focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-white/15
                  group-hover:border-white/30 group-hover:bg-white/15
                  transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute top-1 right-1 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-muted-foreground text-center md:text-left">
          <p>© 2025 ElectroPoint Inc. All rights reserved.</p>
          <div className="flex gap-6 justify-center md:justify-start">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
