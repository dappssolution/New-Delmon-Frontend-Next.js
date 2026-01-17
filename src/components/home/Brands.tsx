"use client";

import { homeApi } from "@/src/service/homeApi";
import { Brand } from "@/src/types/home.types";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Loading from "../common/Loading";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const BrandsSection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await homeApi.getBrands();
        if (res.success && res.data?.brands) {
          setBrands(res.data.brands);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section className="py-10 md:py-14 bg-gradient-to-b from-gray-50 to-white">
        <Loading />
      </section>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className=" w-full mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Our Trusted Brands
          </h2>
        
        </div>

        {/* Swiper Container */}
        <div className="relative">
          

          <Swiper
            modules={[Autoplay]}
            slidesPerView={3}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={1000}
            breakpoints={{
              480: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 35,
              },
              1280: {
                slidesPerView: 6,
                spaceBetween: 40,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            style={{ padding: "12px 0" }}
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <Link
                  href={`/brand/${brand.brand_slug}`}
                  className="group block"
                >
                  <div className="relative bg-white rounded-2xl p-3 md:p-4  shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200">
                    <div className="flex items-center justify-center h-16">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${brand.brand_image}`}
                        alt={brand.brand_name}
                        className="
                          max-h-full
                          max-w-full
                          object-contain
                          opacity-75
                          group-hover:opacity-100
                          group-hover:scale-110
                          transition-all
                          duration-300
                        "
                      />
                    </div>
                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D7263D]/0 to-[#D7263D]/0 group-hover:from-[#D7263D]/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
