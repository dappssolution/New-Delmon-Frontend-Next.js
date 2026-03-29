"use client";

import React, { useMemo } from "react";
import Link from "next/link";

interface Category {
  id: number;
  category_name: string;
  category_slug: string;
}

export default function CategoryPills({ categories = [] }: { categories?: Category[] }) {
  if (!categories || categories.length === 0) return null;

  const midpoint = Math.ceil(categories.length / 2);
  const row1 = categories.slice(0, midpoint);
  const row2 = categories.slice(midpoint);

  return (
    <section className="py-8 md:py-12 bg-linear-to-b from-white via-gray-50/50 to-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 tracking-tight">
            Browse Categories
          </h3>
          <div className="mt-2 mx-auto w-12 h-0.5 bg-linear-to-r from-transparent via-[#0d6838] to-transparent rounded-full" />
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div className="mb-3 md:mb-4">
          <MarqueeRow categories={row1} direction="left" speed={80} />
        </div>

        {row2.length > 0 && (
          <div>
            <MarqueeRow categories={row2} direction="right" speed={90} />
          </div>
        )}
      </div>
    </section>
  );
}

function MarqueeRow({
  categories,
  direction,
  speed,
}: {
  categories: Category[];
  direction: "left" | "right";
  speed: number;
}) {
  const repeatedCategories = useMemo(() => {
    const repeats = Math.max(4, Math.ceil(20 / categories.length));
    const result: Category[] = [];
    for (let i = 0; i < repeats; i++) {
      result.push(...categories);
    }
    return result;
  }, [categories]);

  const animationClass =
    direction === "left"
      ? "animate-category-scroll-left"
      : "animate-category-scroll-right";

  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-3 md:gap-4 w-max ${animationClass}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {repeatedCategories.map((cat, index) => (
          <Link
            key={`${cat.id}-${index}`}
            href={`/category/${cat.category_slug}`}
            className="shrink-0 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold capitalize whitespace-nowrap cursor-pointer select-none
              bg-white text-[#0d6838] border-[1.5px] border-[#0d6838]
              hover:bg-[#0d6838] hover:text-white
              transition-colors duration-300 ease-in-out"
          >
            {cat.category_name.toLowerCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}
