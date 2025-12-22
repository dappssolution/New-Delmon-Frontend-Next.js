"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { homeApi } from "../../service/homeApi";

interface SubCategory {
  id: number;
  subcategory_name: string;
  subcategory_slug: string;
}

export default function CategoryPills() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await homeApi.getCategories("sub-category", 20);
        const data = res.data || [];
        setSubCategories(data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
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

  if (subCategories.length === 0) return null;

  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {subCategories.map((subCat) => (
            <Link
              key={subCat.id}
              href={`/sub-category/${subCat.subcategory_slug}`}
              className="px-3 md:px-5 py-1.5 md:py-2 border border-gray-300 rounded-full text-xs md:text-sm text-gray-700 hover:border-green-700 hover:text-green-700 transition-colors"
            >
              {subCat.subcategory_name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
