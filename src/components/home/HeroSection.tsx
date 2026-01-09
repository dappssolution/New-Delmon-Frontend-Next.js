"use client";

import { homeApi } from "@/src/service/homeApi";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Banner = {
  id: number
  banner_title: string
  banner_url: string
  banner_image: string
  created_at: string
  updated_at: string
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const HeroSection = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

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
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, paginate]);

  if (!banners.length) {
    return (
      <section className="bg-white py-8">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="animate-pulse h-72 bg-gray-200 rounded-lg" />
        </div>
      </section>
    );
  }

  const activeIndex = ((page % banners.length) + banners.length) % banners.length;
  const whatsappUrl = "https://wa.me/971559817240";

  return (
    <section className="bg-white py-4 md:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Mobile & Tablet Slider (hidden on lg) */}
        <div className="lg:hidden relative group h-[200px] sm:h-[300px] md:h-[400px] w-full overflow-hidden rounded-xl">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x * velocity.x;
                if (swipe < -10000) {
                  paginate(1);
                } else if (swipe > 10000) {
                  paginate(-1);
                }
              }}
              className="absolute w-full h-full cursor-pointer"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${banners[activeIndex].banner_image}`}
                  alt={banners[activeIndex].banner_title || "Banner"}
                  className="w-full h-full"
                />
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Dots for mobile slider */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setPage([index, index > activeIndex ? 1 : -1])}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-green-700 w-6" : "bg-white/50 w-2"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Layout (hidden on screens smaller than lg) */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Banners - 30% */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
            {banners.slice(0, 2).map((banner) => (
              <a
                key={banner.id}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-lg overflow-hidden h-48 md:h-[280px] block group/banner"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${banner.banner_image}`}
                  alt={banner.banner_title || "Banner"}
                  className="w-full h-full transition-transform duration-500 group-hover/banner:scale-105"
                />
              </a>
            ))}
          </div>

          {/* Right Main Banner - 70% */}
          {banners[2] && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:col-span-8 relative rounded-lg overflow-hidden h-auto md:h-full lg:min-h-[600px] block group/banner"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${banners[2].banner_image}`}
                alt={banners[2].banner_title || "Special Offer"}
                className="w-full h-full transition-transform duration-500 group-hover/banner:scale-105"
              />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
