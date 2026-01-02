import ProductsGrid from "@/src/components/home/ProductGrid";
import BrandsSection from "../../components/home/Brands";
import BookCategories from "../../components/home/Categories";
import CategoryPills from "../../components/home/CategoryPills";
import HeroSection from "../../components/home/HeroSection";
import MoreProducts from "../../components/home/MoreProduct";
import PromoBanner from "../../components/home/PromoBanner";
import VendorSection from "../../components/home/VendorSection";
import { FadeIn } from "../../components/common";

export default function Home() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Hero Section */}
      <FadeIn>
        <HeroSection />
      </FadeIn>
      {/* Categories */}
      <FadeIn delay={0.2}>
        <BookCategories />
      </FadeIn>
      {/* Products Grid */}
      <FadeIn delay={0.3}>
        <ProductsGrid />
      </FadeIn>
      {/* Promo Banner */}
      <FadeIn delay={0.4}>
        <PromoBanner />
      </FadeIn>
      {/* Brands */}
      <FadeIn delay={0.5}>
        <BrandsSection />
      </FadeIn>
      {/* More Products */}
      <FadeIn delay={0.6}>
        <MoreProducts />
      </FadeIn>
      {/* Vendor Section */}
      <FadeIn delay={0.7}>
        <VendorSection />
      </FadeIn>
      {/* Category Pills */}
      <FadeIn delay={0.8}>
        <CategoryPills />
      </FadeIn>
    </div>
  );
}
