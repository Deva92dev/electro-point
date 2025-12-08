import { LucideIcon, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const OfferedServices: ServiceItem[] = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Industry-grade encryption for every transaction.",
  },
  {
    icon: ShoppingBag,
    title: "Seamless Shopping",
    description: "Intuitive navigation optimized for speed.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Real-time tracking from our door to yours.",
  },
];

const Services = () => {
  return (
    <section className="w-full py-12 bg-muted/30 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {OfferedServices.map((service, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 group"
            >
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:-translate-y-1 transition-transform duration-300">
                  <service.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              {/* Text Content */}
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto sm:mx-0">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
