"use client";

// import { homeApi } from "@/src/service/homeApi";
// import { Brand } from "@/src/types/home.types";
// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import Loading from "../common/Loading";

import { useRef } from "react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Static logos array from public folder
const staticLogos = [
  { id: 1, src: "/logo-one.svg", alt: "Brand Logo 1" },
  { id: 2, src: "/logo-two.svg", alt: "Brand Logo 2" },
  { id: 3, src: "/logo-one.svg", alt: "Brand Logo 3" },
  { id: 4, src: "/logo-two.svg", alt: "Brand Logo 4" },
  { id: 5, src: "/logo-one.svg", alt: "Brand Logo 5" },
  { id: 6, src: "/logo-two.svg", alt: "Brand Logo 6" },
];

const BrandsSection = () => {
  // const [brands, setBrands] = useState<Brand[]>([]);
  // const [loading, setLoading] = useState(true);
  const swiperRef = useRef<any>(null);

  // useEffect(() => {
  //   const fetchBrands = async () => {
  //     try {
  //       const res = await homeApi.getBrands();
  //       if (res.success && res.data?.brands) {
  //         setBrands(res.data.brands);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching brands:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBrands();
  // }, []);

  // if (loading) {
  //   return (
  //     <section className="py-10 md:py-14 bg-gradient-to-b from-gray-50 to-white">
  //       <Loading />
  //     </section>
  //   );
  // }

  // if (brands.length === 0) {
  //   return null;
  // }

  return (
    <section className="py-4 mt-8 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className=" w-full mx-auto px-4 sm:px-6">


        {/* Swiper Container */}
        <div className="relative">


          <Swiper
            modules={[Autoplay]}
            slidesPerView={3}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 2000,
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
            {/* Using static logos instead of dynamic brands */}
            {staticLogos.map((logo) => (
              <SwiperSlide key={logo.id}>
                <div className="group block">
                  <div className="relative rounded-2xl p-3 md:p-4">
                    <div className="flex items-center justify-center">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        style={{ height: "80px", width: "auto" }}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/* Original dynamic brands mapping - commented out */}
            {/* {brands.map((brand) => (
              <SwiperSlide key={brand.id}>
                <Link
                  href={`/brand/${brand.brand_slug}`}
                  className="group block"
                >
                  <div className="relative rounded-2xl p-3 md:p-4">
                    <div className="flex items-center justify-center">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${brand.brand_image}`}
                        alt={brand.brand_name}
                        style={{ height: "80px", width: "auto" }}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))} */}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
