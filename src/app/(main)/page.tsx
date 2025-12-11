import ProductsGrid from "@/src/components/home/ProductGrid";
import ArtBanner from "../../components/home/ArtBanner";
import BottomBadges from "../../components/home/Badges";
import BrandsSection from "../../components/home/Brands";
import BookCategories from "../../components/home/Categories";
import CategoryPills from "../../components/home/CategoryPills";
import HeroSection from "../../components/home/HeroSection";
import MoreProducts from "../../components/home/MoreProduct";
import PromoBanner from "../../components/home/PromoBanner";

export default function Home() {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <HeroSection />
      {/* Categories */}
      <BookCategories />
      {/* Products Grid */}
      <ProductsGrid />
      {/* Promo Banner */}
      <PromoBanner />
      {/* Brands */}
      <BrandsSection />
      {/* More Products */}
      <MoreProducts />
      {/* Art Banner */}
      <ArtBanner />
      {/* Category Pills */}
      <CategoryPills />
      {/* Bottom Badges */}
      <BottomBadges />
    </div>
  );
}
