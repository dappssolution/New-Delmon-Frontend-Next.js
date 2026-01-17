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

// Info card content items
const infoItems = [
  {
    line1: "Quality products.",
    line2: "Locally owned.",
    icon: null,
  },
  {
    line1: "+971 42 88 1400",
    line2: "24/7 Support",
    icon: "phone",
  },
];

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

  // Info card text rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setInfoIndex((prev) => (prev + 1) % infoItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!banners.length) {
    return (
      <section className="bg-white py-4 md:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="animate-pulse h-[400px] md:h-[320px] bg-gray-200 rounded-2xl" />
        </div>
      </section>
    );
  }

  const activeIndex = ((page % banners.length) + banners.length) % banners.length;
  const whatsappUrl = "https://wa.me/971559817240";
  const currentInfo = infoItems[infoIndex];

  return (
    <section className="bg-white py-4 md:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Banner Container */}
        <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl">

          {/* Mobile Layout */}
          <div className="md:hidden relative min-h-[480px]">
            {/* Background Images with Crossfade */}
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

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none z-10" />
            </div>

            {/* Animated Info Card - Left Bottom */}
            <div className="absolute bottom-6 left-4 right-4 z-20">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl py-5 px-5 shadow-xl max-w-xs">
                <div className="flex items-center gap-3">
                  <img
                    src="/delmon-logo-only.png"
                    alt="Delmon Logo"
                    className="w-11 h-11 object-contain flex-shrink-0"
                  />
                  <div className="h-10 w-px bg-gray-200 flex-shrink-0" />
                  <div className="relative flex-1 min-h-[44px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={infoIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="flex items-center gap-2"
                      >
                        {currentInfo.icon === "phone" && (
                          <div className="w-8 h-8 bg-gradient-to-br from-[#1a9c7a] to-[#15b589] rounded-full flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className={`font-bold text-sm leading-tight ${currentInfo.icon === "phone" ? "text-[#1a9c7a]" : "text-gray-800"}`}>
                            {currentInfo.line1}
                          </span>
                          <span className={`font-semibold text-xs leading-tight ${currentInfo.icon === "phone" ? "text-gray-600" : "text-[#1a9c7a]"}`}>
                            {currentInfo.line2}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block relative h-[320px] lg:h-[380px]">
            {/* Background Images with Crossfade */}
            <div className="absolute inset-0">
              {banners.map((banner, index) => (
                <motion.div
                  key={banner.id}
                  initial={false}
                  animate={{
                    opacity: index === activeIndex ? 1 : 0,
                    scale: index === activeIndex ? 1 : 1.02,
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

              {/* Gradient Overlay - Left side for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none z-10" />
            </div>

            {/* Animated Info Card - Left Bottom */}
            <div className="absolute left-8 lg:left-12 bottom-8 lg:bottom-10 z-20">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl py-5 px-6 shadow-xl flex items-center gap-4">
                <img
                  src="/delmon-logo-only.png"
                  alt="Delmon Logo"
                  className="w-12 h-12 lg:w-14 lg:h-14 object-contain flex-shrink-0"
                />
                <div className="h-12 w-px bg-gray-200 flex-shrink-0" />
                <div className="relative min-w-[220px] min-h-[52px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={infoIndex}
                      initial={{ y: 25, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -25, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="flex items-center gap-3"
                    >
                      {currentInfo.icon === "phone" && (
                        <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-[#1a9c7a] to-[#15b589] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <Headphones className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className={`font-bold text-base lg:text-lg leading-tight ${currentInfo.icon === "phone" ? "text-[#1a9c7a]" : "text-gray-800"}`}>
                          {currentInfo.line1}
                        </span>
                        <span className={`font-semibold text-sm lg:text-base leading-tight ${currentInfo.icon === "phone" ? "text-gray-600" : "text-[#1a9c7a]"}`}>
                          {currentInfo.line2}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
