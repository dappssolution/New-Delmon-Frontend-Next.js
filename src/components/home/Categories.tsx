"use client";

import React, { useEffect, useState } from "react";
import { homeApi } from "../../service/homeApi";
import Link from "next/link";

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
  id: number
  main_category_id: number
  category_name: string
  category_slug: string
  category_image?: string
  created_at: string
  updated_at: string
  meta_title: string
  meta_description: string
  meta_keywords: string
}

export interface Link {
  url?: string
  label: string
  active: boolean
}
const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="py-6 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
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
                className="flex flex-col items-center gap-2 md:gap-4 flex-shrink-0 group"
              >
                <div
                  className={`w-24 h-24 md:w-36 md:h-36 rounded-full ${bgColor} flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105`}
                >
                  <img
                    src={imageUrl}
                    alt={cat.category_name}
                    className="w-14 h-20 md:w-20 md:h-28 object-cover mix-blend-multiply"
                    onError={(e) => {
                      (e.currentTarget.src =
                        "https://placehold.co/150x150?text=No+Image");
                    }}
                  />
                </div>

                <p className="text-gray-900 font-medium text-xs md:text-base text-center max-w-[100px] line-clamp-2">
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
