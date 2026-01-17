"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard, { Product } from "../common/ProductCard";
import { homeApi } from "../../service/homeApi";
import { ProductData, ProductResponse } from "../../types/product.types";
import { ArrowRight, Sparkles } from "lucide-react";
import Loading from "../common/Loading";

const ProductsGrid = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch only 12 products for the home page
                const response: ProductResponse = await homeApi.getPaginatedProducts(1, 8);

                if (response.success && response.data) {
                    const mappedProducts: Product[] = response.data.map((item: ProductData) => {
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
                            image: `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.product_thambnail}`,
                            badge: badge,
                            colors: colors.length > 0 ? colors : undefined,
                            sizes: sizes.length > 0 ? sizes : undefined
                        };
                    });
                    setProducts(mappedProducts);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-10 md:py-16 bg-gradient-to-b from-gray-50 to-white">
                <Loading className="h-64" />
            </section>
        );
    }

    return (
        <section className="py-10 md:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden z-0">
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#006637]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#006637]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-[#006637] to-[#00a65a] items-center justify-center shadow-lg shadow-[#006637]/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                Featured Products
                            </h2>
                            <p className="text-gray-500 text-sm mt-0.5 hidden sm:block">
                                Discover our handpicked collection
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/products"
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#006637] rounded-full font-semibold text-sm hover:bg-[#006637] hover:text-white hover:border-[#006637] transition-all duration-300 shadow-sm hover:shadow-md group"
                    >
                        View All Products
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>

                {/* Products Grid with staggered animation */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="animate-fadeIn"
                            style={{
                                animationDelay: `${index * 50}ms`,
                                animationFillMode: 'backwards'
                            }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="flex md:hidden justify-center pt-2">
                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-2 w-full max-w-xs bg-gradient-to-r from-[#006637] to-[#00a65a] text-white py-3.5 rounded-full font-semibold text-sm shadow-lg shadow-[#006637]/25 active:scale-[0.98] transition-transform duration-200"
                    >
                        View All Products
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </section>
    );
};

export default ProductsGrid;
