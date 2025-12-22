"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { homeApi } from "@/src/service/homeApi";
import { SliderData } from "@/src/types/home.types";

export default function PromoBanner() {
  const [sliders, setSliders] = useState<SliderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useEffect(() => {
    if (sliders.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(sliders.length / 2));
    }, 4000);

    return () => clearInterval(interval);
  }, [sliders.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.ceil(sliders.length / 2) - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(sliders.length / 2));
  };

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

  const totalSlides = Math.ceil(sliders.length / 2);
  const currentSliders = sliders.slice(currentIndex * 2, currentIndex * 2 + 2);

  return (
    <section className="py-4 md:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 transition-opacity duration-500"
            >
              {currentSliders.map((slider, index) => (
                <div
                  key={slider.id}
                  className={`relative rounded-lg h-48 md:h-64 flex items-center px-6 md:px-12 overflow-hidden
                    ${index === 0
                      ? "bg-gradient-to-br from-cyan-200 to-cyan-300"
                      : "bg-gradient-to-br from-orange-100 to-orange-200"
                    }`}
                >
                  {/* Text */}
                  <div className="z-10">
                    <h3 className="text-black text-xl md:text-3xl font-bold mb-1 md:mb-2">
                      {slider.slider_title}
                    </h3>
                    <h3 className="text-black text-xl md:text-3xl font-bold">
                      {slider.short_title}
                    </h3>
                  </div>

                  {/* Image */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${slider.slider_image}`}
                    alt={slider.slider_title}
                    className="absolute right-4 md:right-8 h-40 md:h-56 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-20"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Dots Navigation */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${currentIndex === index
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