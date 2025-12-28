import { ProductDetailsType } from "@/utils/types";
import { Activity, Battery, Smartphone } from "lucide-react";

type Props = {
  product: NonNullable<ProductDetailsType>;
};

const Ecosystem = ({ product }: Props) => {
  const specs = product.specs as any;

  const features = [
    {
      title: "Seamless Connection",
      desc: "Instantly pairs with your ecosystem. Transfer data, take calls, and sync notifications without missing a beat.",
      icon: Smartphone,
    },
    {
      title: "All-Day Performance",
      desc: `Powered by the latest chips for up to ${
        specs?.batteryLife || "24 hours"
      } of continuous use on a single charge.`,
      icon: Battery,
    },
    {
      title: "Health & Fitness",
      desc: "Advanced sensors track your movement, sleep, and vitals with clinical precision.",
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, i) => (
        <div
          key={i}
          className="group p-8 rounded-3xl bg-muted/10 border border-border hover:bg-muted/30 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <feature.icon className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-3">{feature.title}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {feature.desc}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Ecosystem;
