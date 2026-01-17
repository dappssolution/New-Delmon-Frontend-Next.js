"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { homeApi } from "@/src/service/homeApi";
import { SliderData } from "@/src/types/home.types";

// 3D slide animation variants
const variants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 45 : -45,
    x: direction > 0 ? "100%" : "-100%",
    z: -300,
  }),
  center: {
    rotateY: 0,
    x: 0,
    z: 0,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    rotateY: direction < 0 ? 45 : -45,
    x: direction < 0 ? "100%" : "-100%",
    z: -300,
    zIndex: 0,
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = isMobile ? 1 : 2;
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
                className="h-52 md:h-64 rounded-3xl bg-gray-100 animate-pulse"
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
        <div
          className="relative"
          style={{ perspective: "1200px" }}
        >
          <div className="relative h-52 md:h-64 w-full">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  rotateY: { type: "spring", stiffness: 100, damping: 20 },
                  x: { type: "spring", stiffness: 100, damping: 20 },
                  z: { duration: 0.5 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {currentSliders.map((slider) => (
                  <a
                    key={slider.id}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative rounded-3xl h-full w-full flex items-center overflow-hidden bg-white cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Image */}
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${slider.slider_image}`}
                      alt={slider.slider_title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </a>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

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