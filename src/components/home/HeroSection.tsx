"use client";

import { homeApi } from "@/src/service/homeApi";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Headphones } from "lucide-react";

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
  const [page, setPage] = useState(0);
  const [infoIndex, setInfoIndex] = useState(0);

  const paginate = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

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

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      paginate();
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, paginate]);



  if (!banners.length) {
    return (
      <section className="bg-white py-4 md:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="animate-pulse h-[160px] md:h-64 bg-gray-200 rounded-2xl" />
        </div>
      </section>
    );
  }

  const activeIndex = ((page % banners.length) + banners.length) % banners.length;
  const whatsappUrl = "https://wa.me/971559817240";


  return (
    <section className="bg-white py-4 md:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Mobile Layout - Single Banner with reduced height */}
        <div className="md:hidden relative h-[160px] overflow-hidden rounded-2xl">
          <div className="absolute inset-0">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={false}
                animate={{
                  opacity: index === activeIndex ? 1 : 0,
                  scale: index === activeIndex ? 1 : 1.05,
                }}
                transition={{
                  opacity: { duration: 0.4, ease: "easeOut" },
                  scale: { duration: 0.6, ease: "easeOut" },
                }}
                className="absolute inset-0"
                style={{ zIndex: index === activeIndex ? 1 : 0 }}
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${banner.banner_image}`}
                    alt={banner.banner_title || "Banner"}
                    className="w-full h-full object-cover"
                  />
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Layout - Two equal columns with 2 images */}
        <div className="hidden md:grid grid-cols-2 gap-4 lg:gap-6 h-64">
          {/* Left Image */}
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
            <AnimatePresence mode="wait">
              {banners.length > 0 && (
                <motion.div
                  key={`left-${activeIndex}`}
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -80, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="absolute inset-0"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${banners[activeIndex].banner_image}`}
                      alt={banners[activeIndex].banner_title || "Banner"}
                      className="w-full h-full object-cover"
                    />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Image */}
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
            <AnimatePresence mode="wait">
              {banners.length > 1 && (
                <motion.div
                  key={`right-${(activeIndex + 1) % banners.length}`}
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -80, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="absolute inset-0"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${banners[(activeIndex + 1) % banners.length].banner_image}`}
                      alt={banners[(activeIndex + 1) % banners.length].banner_title || "Banner"}
                      className="w-full h-full object-cover"
                    />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;