import React from "react";
import {
  BadgePercent,
  Truck,
  Tag,
  Layers,
  RefreshCcw,
} from "lucide-react";

const FEATURES = [
  {
    title: "Best prices",
    description: "Orders AED50 or more",
    bgColor: "bg-lime-200",
    iconBg: "bg-lime-400",
    icon: BadgePercent,
  },
  {
    title: "Free delivery",
    description: "24/7 amazing services",
    bgColor: "bg-blue-200",
    iconBg: "bg-blue-400",
    icon: Truck,
  },
  {
    title: "Great daily deal",
    description: "When you sign up",
    bgColor: "bg-green-200",
    iconBg: "bg-green-400",
    icon: Tag,
  },
  {
    title: "Wide assortment",
    description: "Mega discounts",
    bgColor: "bg-pink-200",
    iconBg: "bg-pink-400",
    icon: Layers,
  },
  {
    title: "Easy returns",
    description: "Within 7 days",
    bgColor: "bg-gray-200",
    iconBg: "bg-gray-400",
    icon: RefreshCcw,
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className={`${feature.bgColor} rounded-lg p-6 pt-10 text-center relative hover:shadow-md transition-shadow`}
              >
                {/* Icon */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center">
                    <div
                      className={`w-8 h-8 ${feature.iconBg} rounded-full flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-700">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
