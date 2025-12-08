"use client";

import {
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Tv,
  Tablet,
  BatteryCharging,
  Wifi,
  ShieldCheck,
  Zap,
  Award,
  Globe,
} from "lucide-react";

const CATEGORIES = [
  { name: "High Performance", icon: Zap, type: "value" },
  { name: "Laptops", icon: Laptop, type: "product" },
  { name: "Premium Audio", icon: Headphones, type: "product" },
  { name: "Smart Home", icon: Wifi, type: "value" },
  { name: "Smartphones", icon: Smartphone, type: "product" },
  { name: "Official Warranty", icon: ShieldCheck, type: "value" },
  { name: "Tablets", icon: Tablet, type: "product" },
  { name: "Next-Gen Gaming", icon: Award, type: "value" },
  { name: "Wearables", icon: Watch, type: "product" },
  { name: "Global Shipping", icon: Globe, type: "value" },
  { name: "4K Displays", icon: Tv, type: "product" },
  { name: "All-Day Battery", icon: BatteryCharging, type: "value" },
];

const MarqueeItem = ({ item }: { item: (typeof CATEGORIES)[0] }) => {
  return (
    <div
      className={`
        flex items-center gap-3 px-8 py-3 mx-4 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-default
        ${
          item.type === "product"
            ? "bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
            : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
        }
      `}
    >
      <item.icon className="w-4 h-4" />
      <span className="text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
        {item.name}
      </span>
    </div>
  );
};

const Marquee = () => {
  return (
    <div className="w-full py-12 overflow-hidden bg-background/80 border-y border-border relative z-10">
      {/* Gradient Masks using semantic 'background' color */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

      {/* Row 1: Scrolling Left */}
      <div className="flex mb-8 w-max min-w-full pause-on-hover">
        <div className="flex animate-scroll-left">
          {CATEGORIES.map((item, idx) => (
            <MarqueeItem key={`a-${idx}`} item={item} />
          ))}
          {CATEGORIES.map((item, idx) => (
            <MarqueeItem key={`b-${idx}`} item={item} />
          ))}
        </div>
      </div>

      {/* Row 2: Scrolling Right (Reversed Data) */}
      <div className="flex w-max min-w-full pause-on-hover">
        <div className="flex animate-scroll-right">
          {[...CATEGORIES].reverse().map((item, idx) => (
            <MarqueeItem key={`c-${idx}`} item={item} />
          ))}
          {[...CATEGORIES].reverse().map((item, idx) => (
            <MarqueeItem key={`d-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
