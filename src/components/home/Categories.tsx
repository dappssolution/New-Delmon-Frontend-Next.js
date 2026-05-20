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


const Categories = ({ categories = [] }: { categories?: Category[] }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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

  if (!categories?.length) return null;

  const CategoryItem = ({ cat, size = "desktop" }: { cat: Category; size?: "desktop" | "mobile" }) => {
    const imageUrl = cat.category_image
      ? cat.category_image.startsWith("http")
        ? cat.category_image
        : `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${cat.category_image}`
      : null;

     const sizeClasses = size === "desktop"
       ? "w-20 h-20 lg:w-24 lg:h-24"
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
        <p className={`text-gray-800 font-medium text-center line-clamp-2 transition-colors group-hover:text-[rgb(0,102,55)] capitalize ${size === "desktop" ? "text-sm lg:text-base max-w-[100px]" : "text-xs max-w-[80px]"}`}>
          {cat.category_name.toLowerCase()}
        </p>
      </Link>
    );
  };

  // Placeholder extra category to show an additional item at the end
  const extraCategory: Category = {
    id: 9999,
    main_category_id: 0,
    category_name: "Extra",
    category_slug: "extra",
    category_image: undefined,
    created_at: "",
    updated_at: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
  };
  const displayCategories = [...categories, extraCategory];

  return (
    <section className="py-6 md:py-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Desktop: Swiper Carousel with Navigation */}
        <div className="hidden md:block relative">
          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            disabled={isBeginning}
            className="category-prev absolute -left-12 top-[40px] lg:top-[48px] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Swiper — edge-to-edge alignment */}
          <div className="-mx-4 sm:-mx-6 px-4 sm:px-6">
            <Swiper
              modules={[Navigation, FreeMode]}
              spaceBetween={12}
              slidesPerView={9}
              slidesPerGroup={9}
              navigation={{
                prevEl: ".category-prev",
                nextEl: ".category-next",
              }}
              speed={500}
              onSwiper={(swiper) => {
                setSwiperInstance(swiper);
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={handleSlideChange}
              className="categories-swiper"
            >
              {displayCategories.map((cat) => (
                <SwiperSlide key={cat.id}>
                  <CategoryItem cat={cat} size="desktop" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            disabled={isEnd}
            className="category-next absolute -right-12 top-[40px] lg:top-[48px] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
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