import { ProductDetailsType } from "@/utils/types";
import { Battery, Camera, Cpu, Maximize, Music, Star, Zap } from "lucide-react";

type Props = {
  product: NonNullable<ProductDetailsType>;
};

const FeatureShowcase = ({ product }: Props) => {
  const specs = product.specs as any;

  // Determine features based on Product Type
  const features = [];

  if (product.productType === "smartphone") {
    features.push(
      {
        icon: Camera,
        label: "Pro Camera System",
        value: specs?.rearCameraMain || "Advanced Lens",
      },
      {
        icon: Cpu,
        label: "Flagship Performance",
        value: specs?.chipset || "Latest Gen Chip",
      },
      {
        icon: Maximize,
        label: "Immersive Display",
        value: `${specs?.screenSize}" ${specs?.screenType}`,
      },
      {
        icon: Battery,
        label: "All-Day Battery",
        value: `${specs?.batteryCapacity}mAh`,
      }
    );
  } else if (product.productType === "headphones") {
    features.push(
      { icon: Music, label: "Audio Quality", value: "Hi-Res Certified" },
      {
        icon: Zap,
        label: "Active Noise Cancel",
        value: specs?.anc ? "Industry Leading" : "Standard",
      },
      {
        icon: Battery,
        label: "Playtime",
        value: specs?.batteryLife || "30 Hours",
      },
      {
        icon: Maximize,
        label: "Comfort Fit",
        value: specs?.headphoneType || "Over-Ear",
      }
    );
  } else {
    // Default Fallback
    features.push(
      { icon: Zap, label: "Performance", value: "High Efficiency" },
      { icon: Star, label: "Rating", value: `${product.averageRating}/5 Stars` }
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {features.map((f, i) => (
        <div
          key={i}
          className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-zinc-900 transition-colors group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 group-hover:scale-110 transition-all">
            <f.icon className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-zinc-400 text-sm font-medium mb-1">{f.label}</h4>
          <p className="text-white font-bold text-lg">{f.value}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureShowcase;
