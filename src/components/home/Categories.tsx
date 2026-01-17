"use client";

import React, { useEffect, useState, useRef } from "react";
import { homeApi } from "../../service/homeApi";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const bgColors = [
  "bg-red-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-gray-200",
  "bg-green-50",
  "bg-cyan-100",
  "bg-pink-100",
  "bg-orange-100",
];

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

export interface LinkType {
  url?: string;
  label: string;
  active: boolean;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for GSAP animation
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // GSAP ScrollTrigger horizontal scroll animation - Mobile only
  useEffect(() => {
    if (loading || !categories?.length || !isMobile) return;

    let ctx: gsap.Context | null = null;

    const initAnimation = () => {
      const section = sectionRef.current;
      const scrollContainer = scrollContainerRef.current;

      if (!section || !scrollContainer) return;

      // Calculate the scroll distance
      const getScrollDistance = () => {
        return scrollContainer.scrollWidth - window.innerWidth;
      };

      const scrollDistance = getScrollDistance();

      // Only create animation if there's content to scroll
      if (scrollDistance <= 0) return;

      // Create GSAP context for cleanup
      ctx = gsap.context(() => {
        gsap.to(scrollContainer, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            pinSpacing: false,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      }, section);
    };

    // Wait for DOM to be fully ready
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        initAnimation();
      });
    }, 300);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      if (ctx) {
        ctx.revert();
      }
      // Kill all ScrollTriggers when switching to desktop
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading, categories, isMobile]);

  console.log("cateogeissss:", categories);

  if (loading) {
    return (
      <section className="py-6 md:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories?.length) return null;

  // Desktop: Normal layout with proper spacing
  // Mobile: GSAP horizontal scroll animation
  return (
    <section
      ref={sectionRef}
      className={`categories-section bg-white overflow-hidden ${isMobile
        ? "h-[170px] max-h-[170px] flex items-center relative z-10   shadow-md"
        : "py-6 md:py-12"
        }`}
    >
      <div
        className={`${isMobile ? "w-full" : "max-w-[1400px] mx-auto px-4 sm:px-6"}`}
      >
        <div
          ref={scrollContainerRef}
          className={`flex gap-3 md:gap-8 will-change-transform ${isMobile
            ? "px-3"
            : "overflow-x-auto pb-4 scrollbar-hide"
            }`}
          style={isMobile ? { width: "max-content" } : {}}
        >
          {categories.map((cat, idx) => {
            const bgColor = bgColors[idx % bgColors.length];

            const imageUrl = cat.category_image
              ? cat.category_image.startsWith("http")
                ? cat.category_image
                : `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${cat.category_image}`
              : "https://placehold.co/150x150?text=No+Image";

            return (
              <Link
                key={cat.id}
                href={`/category/${cat.category_slug}`}
                className={`flex flex-col items-center flex-shrink-0 group ${isMobile ? "gap-1" : "gap-2 md:gap-4"}`}
              >
                <div
                  className={`${isMobile ? "w-16 h-16" : "w-24 h-24 md:w-36 md:h-36"} rounded-full ${bgColor} flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105`}
                >
                  <img
                    src={imageUrl}
                    alt={cat.category_name}
                    className={`${isMobile ? "w-10 h-14" : "w-14 h-20 md:w-20 md:h-28"} object-cover mix-blend-multiply`}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/150x150?text=No+Image";
                    }}
                  />
                </div>

                <p className={`text-gray-900 font-medium text-center line-clamp-2 ${isMobile ? "text-[10px] max-w-[70px]" : "text-xs md:text-base max-w-[100px]"}`}>
                  {cat.category_name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
