"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { homeApi } from "@/src/service/homeApi";
import { SliderData } from "@/src/types/home.types";

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

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function PromoBanner() {
  const [sliders, setSliders] = useState<SliderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);

  const itemsPerPage = 2;
  const totalPages = Math.ceil(sliders.length / itemsPerPage);

  const sliderIndex = ((page % totalPages) + totalPages) % totalPages;

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await homeApi.getSlider();
        if (res.success && res.data) {
          setSliders(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch sliders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  useEffect(() => {
    if (sliders.length === 0) return;

    const interval = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliders.length, paginate]);

  const currentSliders = sliders.slice(
    sliderIndex * itemsPerPage,
    sliderIndex * itemsPerPage + itemsPerPage
  );

  const whatsappUrl = "https://wa.me/971559817240";

  if (loading) {
    return (
      <section className="py-6">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 md:h-64 rounded-lg bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (sliders.length === 0) return null;

  return (
    <section className="py-4 md:py-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="relative group">

          <div className="relative h-[27rem] md:h-64 w-full">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
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
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                {currentSliders.map((slider, index) => (
                  <a
                    key={slider.id}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative rounded-lg h-48 md:h-64 flex items-center px-6 md:px-12 overflow-hidden bg-white cursor-pointer group/promo`}
                  >

                    {/* Image */}
                    <motion.img
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${slider.slider_image}`}
                      alt={slider.slider_title}
                      className="absolute right-4 md:right-8 h-40 md:h-56 w-auto object-fill transition-transform duration-500 group-hover/promo:scale-105"
                    />
                  </a>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={() => paginate(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all z-20 opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all z-20 opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Dots Navigation */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 absolute -bottom-8 left-0 right-0">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage([index, index > sliderIndex ? 1 : -1])}
                  className={`h-2 rounded-full transition-all duration-300 ${sliderIndex === index
                    ? "bg-cyan-500 w-8"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}