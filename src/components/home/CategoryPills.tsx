"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { homeApi } from "../../service/homeApi";

interface Category {
  id: number;
  category_name: string;
  category_slug: string;
}

export default function CategoryPills() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await homeApi.getCategories("category", 20);
        const data = res.data || [];
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-4 md:py-6 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {[...Array(10)].map((_, idx) => (
              <div key={idx} className="h-8 w-24 bg-gray-100 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.category_slug}`}
              className="px-3 md:px-5 py-1.5 md:py-2 border border-gray-300 rounded-full text-xs md:text-sm text-gray-700 hover:border-green-700 hover:text-green-700 transition-colors"
            >
              {cat.category_name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
