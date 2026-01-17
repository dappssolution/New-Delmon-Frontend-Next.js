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
        {/* Mobile Layout - Single Banner with reduced height */}
        <div className="md:hidden relative h-[280px] overflow-hidden rounded-2xl">
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

        {/* Desktop Layout - Two Banner Cards Side by Side */}
        <div className="hidden md:flex gap-4 lg:gap-6 h-[320px] lg:h-[380px]">
          {/* Left Banner Card */}
          <div className="relative flex-1 overflow-hidden rounded-2xl lg:rounded-3xl">
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
            </div>

          
          </div>

          {/* Right Banner Card */}
          <div className="relative flex-1 overflow-hidden rounded-2xl lg:rounded-3xl">
            <div className="absolute inset-0">
              {banners.map((banner, index) => {
                // Show next banner on the right card
                const nextIndex = (activeIndex + 1) % banners.length;
                return (
                  <motion.div
                    key={banner.id}
                    initial={false}
                    animate={{
                      opacity: index === nextIndex ? 1 : 0,
                      scale: index === nextIndex ? 1 : 1.02,
                    }}
                    transition={{
                      opacity: { duration: 0.4, ease: "easeOut" },
                      scale: { duration: 0.6, ease: "easeOut" },
                    }}
                    className="absolute inset-0"
                    style={{ zIndex: index === nextIndex ? 1 : 0 }}
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
