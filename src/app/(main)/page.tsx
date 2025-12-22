import ProductsGrid from "@/src/components/home/ProductGrid";
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
      {/* Category Pills */}
      <CategoryPills />
    </div>
  );
}
