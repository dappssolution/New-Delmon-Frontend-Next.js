"use client";

import { homeApi } from "@/src/service/homeApi";
import React, { useEffect, useState } from "react";

type Banner = {
  id: number
  banner_title: string
  banner_url: string
  banner_image: string
  created_at: string
  updated_at: string
};

const HeroSection = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  useEffect(() => {
    async function getBanners() {
      try {
        const res = await homeApi.getBanners();
        setBanners(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    getBanners();
  }, []);
  if (!banners.length) {
    return (
      <section className="bg-white py-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="animate-pulse h-72 bg-gray-200 rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-4 md:py-8">
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
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${banner.banner_image}`}
                  alt={banner.banner_title || "Banner"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Right Banner - 70% */}
          {banners[2] && (
            <div className="lg:col-span-8 relative rounded-lg overflow-hidden h-auto md:h-full lg:min-h-[600px]">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${banners[2].banner_image}`}
                alt={banners[2].banner_title || "Special Offer"}
                className="w-full h-auto md:h-full md:object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
