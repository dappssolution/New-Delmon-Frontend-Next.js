"use client";

import React, { useEffect, useState, useRef } from "react";
import { homeApi } from "../../service/homeApi";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export interface Category {
  id: number;
  main_category_id: number;
  category_name: string;
  category_slug: string;
  category_image?: string;
  created_at: string;
  updated_at: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await homeApi.getCategories("category");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  if (loading) {
    return (
      <section className="py-6 md:py-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Desktop Loading */}
          <div className="hidden md:flex gap-6 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
          {/* Mobile Loading */}
          <div className="md:hidden grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories?.length) return null;

  const CategoryItem = ({ cat, size = "desktop" }: { cat: Category; size?: "desktop" | "mobile" }) => {
    const imageUrl = cat.category_image
      ? cat.category_image.startsWith("http")
        ? cat.category_image
        : `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${cat.category_image}`
      : null;

    const sizeClasses = size === "desktop"
      ? "w-28 h-28 lg:w-32 lg:h-32"
      : "w-16 h-16 sm:w-20 sm:h-20";

    return (
      <Link
        href={`/category/${cat.category_slug}`}
        className="flex flex-col items-center gap-2 lg:gap-3 group"
      >
        <div
          className={`${sizeClasses} rounded-full bg-gray-50 flex items-center justify-center overflow-hidden transition-all duration-300 bg-cover bg-center border-2 border-gray-100 group-hover:border-[rgb(0,102,55)] group-hover:shadow-[0_8px_25px_rgba(0,102,55,0.35)]`}
          style={
            imageUrl
              ? { backgroundImage: `url(${imageUrl})` }
              : undefined
          }
        >
          {!imageUrl && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
        <p className={`text-gray-800 font-medium text-center line-clamp-2 transition-colors group-hover:text-[rgb(0,102,55)] ${size === "desktop" ? "text-sm lg:text-base max-w-[100px]" : "text-xs max-w-[80px]"}`}>
          {cat.category_name}
        </p>
      </Link>
    );
  };

  return (
    <section className="py-6 md:py-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Desktop: Swiper Carousel with Navigation */}
        <div className="hidden md:block relative">
          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:bg-gray-50 ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Swiper */}
          <div className="px-12">
            <Swiper
              modules={[Navigation, FreeMode]}
              spaceBetween={24}
              slidesPerView="auto"
              freeMode={{
                enabled: true,
                sticky: false,
                momentumBounce: false,
              }}
              speed={500}
              onSwiper={(swiper) => {
                setSwiperInstance(swiper);
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={handleSlideChange}
              onReachBeginning={() => setIsBeginning(true)}
              onReachEnd={() => setIsEnd(true)}
              className="categories-swiper"
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat.id} style={{ width: "auto" }}>
                  <CategoryItem cat={cat} size="desktop" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:bg-gray-50 ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile: Horizontal Scrollable Row */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {categories.map((cat) => (
              <div key={cat.id} className="flex-shrink-0">
                <CategoryItem cat={cat} size="mobile" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;