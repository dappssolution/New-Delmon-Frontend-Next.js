"use client";

import React from "react";
import { Users, Truck, Package, ShoppingBag } from "lucide-react";

const stats = [
  {
    icon: <Users className="w-6 h-6" />,
    value: "30K",
    label: "Happy customers",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    value: "100K",
    label: "Deliveries made",
  },
  {
    icon: <Package className="w-6 h-6" />,
    value: "5K",
    label: "Products & services",
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    value: "3.5K",
    label: "Online orders",
  },
];

const StatsBanner = () => {
  return (
    <div className="w-full bg-[#0d6838] relative overflow-hidden">
      {/* Subtle abstract background curves/shapes to match the image's vibe */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-[#0a522c] rounded-bl-full opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-[50%] -right-[10%] w-[40%] h-[150%] bg-[#084223] rounded-t-full opacity-50 transform -rotate-12 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
        <div className="flex flex-col xl:flex-row justify-between items-center gap-12 xl:gap-8">
          
          {/* Left Title */}
          <div className="shrink-0 text-center xl:text-left">
            <h2 className="text-white text-xl md:text-2xl font-medium mb-1">Trusted by</h2>
            <p className="text-[#4ade80] text-3xl md:text-4xl font-bold">10,000+ users</p>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 w-full grid grid-cols-2 sm:flex sm:flex-row xl:flex-nowrap justify-center xl:justify-end items-start sm:items-center gap-y-8 sm:gap-y-0 sm:divide-x divide-white/20">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center xl:items-start text-center xl:text-left px-2 sm:px-6 xl:px-12 ${index % 2 === 0 ? 'border-r border-white/20 sm:border-r-0 sm:border-transparent' : ''}`}
              >
                <div className="text-white mb-3 opacity-90">
                  {stat.icon}
                </div>
                <div className="flex items-center text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                  <span className="text-[#4ade80] ml-1">+</span>
                </div>
                <div className="text-white/80 text-xs md:text-sm font-medium whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatsBanner;
