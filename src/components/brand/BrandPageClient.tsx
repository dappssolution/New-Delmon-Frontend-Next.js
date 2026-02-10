"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard, { Product } from "../common/ProductCard";
import Pagination from "../common/Pagination";
import Loading from "../common/Loading";
import { homeApi } from "../../service/homeApi";
import { BrandProduct, BrandProductsResponse, BrandInfo } from "../../types/brand.types";
import { Brand as HomeBrand } from "../../types/home.types";

interface BrandPageClientProps {
    slug: string;
}

const BrandPageClient = ({ slug }: BrandPageClientProps) => {
    const [products, setProducts] = useState<BrandProduct[]>([]);
    const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
    const [allBrands, setAllBrands] = useState<HomeBrand[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        const fetchBrandData = async () => {
            setLoading(true);
            try {
                const res: BrandProductsResponse = await homeApi.getBrandProducts(slug, {
                    per_page: 12,
                    simple: true,
                    page: currentPage,
                });

                if (res.success && res.data) {
                    setProducts(res.data.products);
                    setBrandInfo(res.data.brand);
                    setLastPage(res.meta.last_page || 1);
                }

                const brandsRes = await homeApi.getBrands();
                if (brandsRes.success && brandsRes.data?.brands) {
                    setAllBrands(brandsRes.data.brands);
                }
            } catch (error) {
                console.error("Failed to fetch brand data", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchBrandData();
    }, [slug, currentPage]);

    const transformProduct = (apiProduct: BrandProduct): Product => {
        const sellingPrice = parseFloat(apiProduct.selling_price);
        const discountPrice = apiProduct.discount_price ? parseFloat(apiProduct.discount_price) : 0;
        const hasDiscount = discountPrice > 0;

        const discountPercent = hasDiscount
            ? Math.round(((sellingPrice - discountPrice) / sellingPrice) * 100)
            : null;

        const colors = apiProduct.product_color ? apiProduct.product_color.split(',').map(c => c.trim()).filter(Boolean) : [];
        const sizes = apiProduct.product_size ? apiProduct.product_size.split(',').map(s => s.trim()).filter(Boolean) : [];

        return {
            id: apiProduct.id,
            slug: apiProduct.product_slug,
            category: apiProduct.category?.category_name || "Product",
            title: apiProduct.product_name,
            price: hasDiscount ? `AED ${apiProduct.discount_price}` : `AED ${apiProduct.selling_price}`,
            oldPrice: hasDiscount ? `AED ${apiProduct.selling_price}` : undefined,
            image: `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${apiProduct.product_thambnail}`,
            product_qty: apiProduct.product_qty,
            discount: discountPercent ? `${discountPercent}% Offer` : undefined,
            colors: colors.length > 0 ? colors : undefined,
            sizes: sizes.length > 0 ? sizes : undefined
        };
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && currentPage === 1) {
        return <Loading className="min-h-screen" />;
    }

    return (
        <div className="bg-white min-h-screen pb-12">
            {/* Header / Breadcrumb area */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                    <Link href="/" className="hover:text-green-700">Delmon</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/" className="hover:text-green-700">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900">Brands</span>
                </div>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Brands</h1>
                    <p className="text-green-700 text-lg">Discover products based on your favorite brand</p>
                </div>

                {/* Brands Logo Strip */}
                <div className="border-b border-gray-100 pb-12 mb-12 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-12 min-w-max px-4">
                        {allBrands.map((brand) => (
                            <Link
                                href={`/brand/${brand.brand_slug}`}
                                key={brand.id}
                                className={`shrink-0 grayscale hover:grayscale-0 transition-all duration-300 ${brand.brand_slug === slug ? 'grayscale-0 scale-110' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${brand.brand_image}`}
                                    alt={brand.brand_name}
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Promo Banners (Middle Section) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="relative group overflow-hidden rounded-2xl aspect-4/3 bg-gray-100">
                            <div className="absolute inset-0 bg-linear-to-r from-gray-200 to-gray-300 animate-pulse" />
                            <div className="absolute inset-0 p-8 flex flex-col justify-center z-10">
                                <span className="text-gray-900 font-medium mb-2">40% Offer</span>
                                <h3 className="text-2xl font-bold text-gray-900 max-w-[150px]">Pencil Collections</h3>
                            </div>
                            <div className="absolute right-[-20%] top-[-10%] w-full h-[120%] rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400"
                                    className="w-full h-full object-contain mix-blend-multiply opacity-80"
                                    alt="Promo"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Products Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>

                    {loading ? (
                        <Loading className="h-64" />
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {products.map(apiProduct => (
                                    <ProductCard
                                        key={apiProduct.id}
                                        product={transformProduct(apiProduct)}
                                        backgroundColor="bg-[#F8F8F8]"
                                    />
                                ))}
                            </div>
                            {lastPage > 1 && (
                                <div className="mt-12">
                                    <Pagination
                                        currentPage={currentPage}
                                        lastPage={lastPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-20 text-center bg-gray-50 rounded-3xl">
                            <div className="text-gray-300 text-8xl mb-6">📦</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-8">We couldn&apos;t find any products for this brand at the moment.</p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-full transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandPageClient;
