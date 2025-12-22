"use client";

import { useEffect, useState } from "react";
import ProductCard, { Product } from "../common/ProductCard";
import { homeApi } from "../../service/homeApi";

interface ApiProduct {
  id: number;
  product_name: string;
  product_slug: string;
  product_thambnail: string;
  selling_price: string;
  discount_price: string | null;
  product_color?: string;
  product_size?: string;
  category: {
    category_name: string;
  };
}

export default function MoreProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await homeApi.getProducts();
        if (response.success && response.data) {
          const mappedProducts: Product[] = response.data
            .slice(0, 4) // Show only 4 products
            .map((item: ApiProduct) => {
              const hasDiscount = item.discount_price !== null;
              let finalPrice = item.selling_price;
              let oldPrice = undefined;
              let badge = undefined;

              if (item.discount_price) {
                finalPrice = item.discount_price;
                oldPrice = item.selling_price;
                const sell = parseFloat(item.selling_price);
                const disc = parseFloat(item.discount_price);
                if (sell > 0) {
                  const percent = Math.round(((sell - disc) / sell) * 100);
                  badge = `${percent}% Off`;
                }
              }

              const colors = item.product_color ? item.product_color.split(',').map(c => c.trim()).filter(Boolean) : [];
              const sizes = item.product_size ? item.product_size.split(',').map(s => s.trim()).filter(Boolean) : [];

              return {
                id: item.id,
                slug: item.product_slug,
                category: item.category?.category_name || "Uncategorized",
                title: item.product_name,
                price: `AED${finalPrice}`,
                oldPrice: oldPrice ? `AED${oldPrice}` : undefined,
                image: `https://palegoldenrod-wombat-569197.hostingersite.com/${item.product_thambnail}`,
                badge: badge,
                colors: colors.length > 0 ? colors : undefined,
                sizes: sizes.length > 0 ? sizes : undefined
              };
            });
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch suggested products", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-6 md:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
          Suggested Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showBadge={false}
              backgroundColor="bg-gray-50"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

