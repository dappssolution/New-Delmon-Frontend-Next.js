"use client";

import { homeApi } from "@/src/service/homeApi";
import { Brand } from "@/src/types/home.types";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "../common/Loading";

const BrandsSection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

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

  const duplicatedBrands = [...brands, ...brands, ...brands];

  if (loading) {
    return (
      <section className="py-6 md:py-8 bg-gray-50">
        <Loading />
      </section>
    );
  }

  return (
    <section className="py-6 md:py-8 bg-gray-50">
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 overflow-hidden">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 3));
            }
          }
          
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
          
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}} />
        <div className="flex items-center animate-scroll">
          {duplicatedBrands.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="shrink-0 px-6 md:px-10"
            >
              <Link href={`/brand/${brand.brand_slug}`}>
                <img
  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${brand.brand_image}`}
  alt={brand.brand_name}
  className="
    h-14
    md:h-20
    lg:h-24
    w-auto
    object-contain
    opacity-80
    hover:opacity-100
    hover:scale-105
    transition-all
    duration-300
    cursor-pointer
  "
/>

              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;