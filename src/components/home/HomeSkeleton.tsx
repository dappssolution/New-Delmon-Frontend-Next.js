"use client";

import React from "react";

// Modern Shimmer Skeleton Component
export default function HomeSkeleton() {
  return (
    <div className="w-full bg-white overflow-hidden">
      <HeroSectionSkeleton />
      <CategoriesSkeleton />
      <ProductsGridSkeleton />
      <PromoBannerSkeleton />
    </div>
  );
}

const HeroSectionSkeleton = () => {
  return (
    <section className="bg-white py-4 md:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Mobile Layout */}
        <div className="md:hidden relative h-[160px] overflow-hidden rounded-2xl animate-shimmer" />

        {/* Desktop Layout - Based on Figma (1/3 stacked left, 2/3 large right) */}
        <div className="hidden md:grid grid-cols-3 gap-4 lg:gap-6 h-[400px]">
          {/* Left Column - 2 Stacked Images */}
          <div className="col-span-1 grid grid-rows-2 gap-4 lg:gap-6 h-full">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl animate-shimmer" />
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl animate-shimmer" />
          </div>

          {/* Right Column - 1 Large Image */}
          <div className="col-span-2 relative overflow-hidden rounded-2xl lg:rounded-3xl animate-shimmer" />
        </div>
      </div>
    </section>
  );
};

const CategoriesSkeleton = () => {
  return (
    <section className="py-6 md:py-10 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Desktop Layout */}
        <div className="hidden md:flex gap-6 overflow-hidden px-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 lg:gap-3 shrink-0">
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full animate-shimmer" />
              <div className="h-4 w-20 rounded-md animate-shimmer" />
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-hidden pb-2 -mx-4 px-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full animate-shimmer" />
                <div className="h-3 w-14 rounded-md animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductsGridSkeleton = () => {
  return (
    <section className="py-6 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 rounded-md animate-shimmer" />
          <div className="hidden md:block h-6 w-32 rounded-md animate-shimmer" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 mb-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden p-2 md:p-4 border border-gray-200">
              {/* Image Skeleton */}
              <div className="aspect-4/3 rounded-xl animate-shimmer mb-4" />
              
              {/* Content Skeleton */}
              <div className="space-y-3">
                {/* Title */}
                <div className="h-4 w-3/4 rounded-md animate-shimmer" />
                {/* Category */}
                <div className="h-3 w-1/2 rounded-md animate-shimmer" />
                
                {/* Price Row */}
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-md animate-shimmer" />
                  <div className="h-5 w-12 rounded-md animate-shimmer opacity-50" />
                </div>
                
                {/* Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 h-10 md:h-11 rounded-xl animate-shimmer" />
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl shrink-0 animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex md:hidden justify-center">
          <div className="h-12 w-full max-w-xs rounded-md animate-shimmer" />
        </div>
      </div>
    </section>
  );
};

const PromoBannerSkeleton = () => {
  return (
    <section className="py-4 md:py-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="relative h-52 md:h-64 w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Mobile shows 1, Desktop shows 2 */}
          <div className="rounded-3xl h-full w-full animate-shimmer" />
          <div className="hidden md:block rounded-3xl h-full w-full animate-shimmer" />
        </div>
        
        {/* Dots Navigation Skeleton */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="h-2 w-8 rounded-full animate-shimmer" />
          <div className="h-2 w-2 rounded-full animate-shimmer" />
          <div className="h-2 w-2 rounded-full animate-shimmer" />
        </div>
      </div>
    </section>
  );
};
