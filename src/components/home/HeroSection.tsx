"use client";

import { homeApi } from "@/src/service/homeApi";
import React, { useEffect, useState } from "react";

type Banner = {
  id: number;
  slider_title: string;
  short_title: string;
  slider_image: string;
};

const HeroSection = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const IMAGE_BASE = "https://palegoldenrod-wombat-569197.hostingersite.com/";
  useEffect(() => {
    async function getBanners() {
      try {
        const res = await homeApi.getBanners();
        console.log(res, "home apii");
        setBanners(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    getBanners();
  }, []);
  if (!banners.length) {
    return (
      <section className="bg-gray-50 py-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="animate-pulse h-72 bg-gray-200 rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-4 md:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Banner - 30% */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
            {banners.slice(0, 2).map((banner) => (
              <div
                key={banner.id}
                className="relative rounded-lg overflow-hidden h-48 md:h-[280px]"
              >
                <img
                  src={`${IMAGE_BASE}${banner.slider_image}`}
                  alt={banner.slider_title || "Banner"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Right Banner - 70% */}
          {banners[2] && (
            <div className="lg:col-span-8 relative rounded-lg overflow-hidden h-96 md:h-full min-h-[400px] lg:min-h-[600px]">
              <img
                src={`${IMAGE_BASE}${banners[2].slider_image}`}
                alt={banners[2].slider_title || "Special Offer"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
