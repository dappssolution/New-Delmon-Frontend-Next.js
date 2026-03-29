"use client";

import { useEffect, useState } from "react";
import ProductsGrid from "@/src/components/home/ProductGrid";
import BrandsSection from "../../components/home/Brands";
import BookCategories from "../../components/home/Categories";
import CategoryPills from "../../components/home/CategoryPills";
import HeroSection from "../../components/home/HeroSection";
import MoreProducts from "../../components/home/MoreProduct";
import PromoBanner from "../../components/home/PromoBanner";
import VendorSection from "../../components/home/VendorSection";
import GoogleReviews from "../../components/home/GoogleReviews";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import StatsBanner from "../../components/home/StatsBanner";
import NewsletterBanner from "../../components/home/NewsletterBanner";
import { FadeIn } from "../../components/common";
import { homeApi } from "../../service/homeApi";
import HomeSkeleton from "../../components/home/HomeSkeleton";

export default function Home() {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await homeApi.getHomeData();
        if (res.success && res.data) {
          setHomeData(res.data);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  if (!homeData) return null;

  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Hero Section */}
      <FadeIn>
        <HeroSection banners={homeData.banners} />
      </FadeIn>
      {/* Categories */}
      <FadeIn delay={0.2}>
        <BookCategories categories={homeData.categories} />
      </FadeIn>
      {/* Products Grid */}
      <FadeIn delay={0.3}>
        <ProductsGrid initialProducts={homeData.products} />
      </FadeIn>
      {/* Promo Banner */}
      <FadeIn delay={0.4}>
        <PromoBanner sliders={homeData.sliders} />
      </FadeIn>
      {/* Brands */}
      <FadeIn delay={0.5}>
        <BrandsSection brands={homeData.brands} />
      </FadeIn>
      {/* More Products */}
      <FadeIn delay={0.6}>
        <MoreProducts homeData={homeData} />
      </FadeIn>
      {/* Vendor Section */}
      <FadeIn delay={0.7}>
        <VendorSection vendors={homeData.vendors} />
      </FadeIn>
      {/* Category Pills */}
      <FadeIn delay={0.8}>
        <CategoryPills categories={homeData.categories} />
      </FadeIn>
       {/* Why Choose Us */}
      <FadeIn delay={0.75}>
        <WhyChooseUs />
      </FadeIn>
        {/* Stats Banner */}
      <FadeIn delay={0.72}>
        <StatsBanner />
      </FadeIn>
      {/* Google Reviews */}
      <FadeIn delay={0.9}>
        <GoogleReviews />
      </FadeIn>
      {/* Newsletter Banner */}
      <FadeIn delay={1.0}>
        <NewsletterBanner />
      </FadeIn>
    </div>
  );
}
