"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag, Truck, Percent, Headset, ChevronRight } from "lucide-react";

import { contractApi } from "@/src/service/contractApi";
import { homeApi } from "@/src/service/homeApi";
import { useAppSelector } from "@/src/hooks/useRedux";
import { RootState } from "@/src/redux/store";
import ProductCard, { Product } from "@/src/components/common/ProductCard";
import Loading from "@/src/components/common/Loading";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

interface Brand {
    id: number;
    brand_name: string;
    brand_slug: string;
    brand_image?: string;
}

export default function ContractProductsPage() {
    const router = useRouter();
    const { token } = useAppSelector((state: RootState) => state.auth);

    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch contract products
                const contractRes = await contractApi.getContractProducts();

                if (contractRes.status && contractRes.data && contractRes.data.products.data) {
                    const contractItems = contractRes.data.products.data;

                    const validProducts = contractItems.map((item: any) => {
                        const finalPrice = item.discount_price || item.selling_price;
                        const oldPrice = item.discount_price ? item.selling_price : undefined;

                        let badge = undefined;
                        if (item.discount_price) {
                            const sell = parseFloat(item.selling_price);
                            const disc = parseFloat(item.discount_price);
                            if (sell > 0) {
                                const percent = Math.round(((sell - disc) / sell) * 100);
                                badge = `${percent}% Off`;
                            }
                        }

                        const colors = item.product_color ? item.product_color.split(',').map((c: string) => c.trim()) : undefined;
                        const sizes = item.product_size ? item.product_size.split(',').map((s: string) => s.trim()) : undefined;

                        return {
                            id: item.id,
                            slug: item.product_slug,
                            category: item.category?.category_name || "Technology",
                            title: item.product_name,
                            price: `AED ${finalPrice}`,
                            oldPrice: oldPrice ? `AED ${oldPrice}` : undefined,
                            image: `https://palegoldenrod-wombat-569197.hostingersite.com/${item.product_thambnail}`,
                            badge,
                            colors,
                            sizes
                        } as Product;
                    });

                    setProducts(validProducts);
                } else {
                    setError("No contract products found");
                }

                // Fetch brands
                const brandsRes = await homeApi.getBrands();
                if (brandsRes.success && brandsRes.data && brandsRes.data.brands) {
                    setBrands(brandsRes.data.brands.slice(0, 12));
                }

            } catch (err: any) {
                console.error(err);
                setError("Failed to load contract products");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FDF9]">
                <p className="text-red-500 mb-4">{error}</p>
                <Link href="/" className="text-green-700 underline font-medium">Back to Home</Link>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="bg-white min-h-screen">
                {/* Banner Section */}
                <div className="relative w-full h-[250px] md:h-[320px] bg-[#E8F3ED] overflow-hidden">
                    {/* Placeholder for the user's background image */}
                    <Image
                        src="/images/contract-banner.jpg"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-[#E8F3ED]/90 via-[#E8F3ED]/50 to-transparent z-10" />

                    <div className="relative z-20 h-full max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-3xl md:text-5xl font-bold text-[#114f30] mb-3 leading-tight">
                                Contract Products
                            </h1>
                            <p className="text-gray-600 text-sm md:text-lg max-w-md">
                                Browse our exclusive contract products for corporate and bulk purchase
                            </p>
                        </div>
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
                    <nav className="flex items-center text-xs md:text-sm text-gray-500 font-medium">
                        <Link href="/" className="hover:text-green-700 transition-colors">Delmon</Link>
                        <ChevronRight className="w-3 h-3 mx-2" />
                        <Link href="/contract" className="hover:text-green-700 transition-colors">Contract</Link>
                        <ChevronRight className="w-3 h-3 mx-2" />
                        <span className="text-gray-400">Contract Product</span>
                    </nav>
                </div>

                {/* Products Grid */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20">
                    {products.length === 0 ? (
                        <div className="text-center py-24 text-gray-400">
                            <p className="text-lg">No products found in your contract.</p>
                            <Link href="/" className="text-green-700 underline mt-2 inline-block">Explore our catalog</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {products.map((product, index) => (
                                <ProductCard key={`${product.id}-${index}`} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Why Choose DALMON Section */}
                <div className="bg-[#F8FDF9] py-20 relative overflow-hidden">
                    {/* Suble Leaf Pattern Decoration */}
                    <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#114f30" d="M44.7,-76.4C58.3,-69.2,70,-58.5,78.2,-45.8C86.4,-33.1,91.1,-18.5,91.1,-3.9C91.1,10.7,86.4,25.3,78.2,38C70,50.7,58.3,61.4,44.7,68.6C31.1,75.8,15.6,79.5,0.1,79.3C-15.4,79.1,-30.8,75.1,-44.4,67.9C-58,60.7,-69.8,50.3,-78,37.6C-86.2,24.9,-90.8,9.9,-90.8,-5.1C-90.8,-20.1,-86.2,-35.1,-78,-47.8C-69.8,-60.5,-58,-70.9,-44.4,-78.1C-30.8,-85.3,-15.4,-89.3,0,-89.3C15.4,-89.3,31.1,-85.3,44.7,-76.4Z" transform="translate(100 100)" />
                        </svg>
                    </div>

                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#114f30] text-center mb-16">
                            Why choose DALMON for your contract needs
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                            {/* Best Prices */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-white rounded-2xl border border-yellow-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center">
                                        <Tag className="w-7 h-7 text-yellow-500" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">Best Prices</h3>
                            </div>

                            {/* Fast Bulk Delivery */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-white rounded-2xl border border-green-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                                        <Truck className="w-7 h-7 text-green-600" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">Fast Bulk Delivery</h3>
                            </div>

                            {/* Bulk Discounts */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-white rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <Percent className="w-7 h-7 text-emerald-600" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">Bulk Discounts</h3>
                            </div>

                            {/* Dedicated Support */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-white rounded-2xl border border-blue-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <Headset className="w-7 h-7 text-blue-600" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">Dedicated Support</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Brands Section */}
                <div className="bg-white py-24">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#114f30] text-center mb-16">
                            Top Brands For Contract Purchase
                        </h2>

                        {brands.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                {brands.map((brand) => (
                                    <Link
                                        key={brand.id}
                                        href={`/brand/${brand.brand_slug}`}
                                        className="border border-gray-100 rounded-2xl p-8 flex items-center justify-center min-h-[140px] hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 bg-white group"
                                    >
                                        <Image
                                            src={`https://palegoldenrod-wombat-569197.hostingersite.com/${brand.brand_image}`}
                                            alt={brand.brand_name}
                                            width={140}
                                            height={70}
                                            className="object-contain max-h-20 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                        />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                                    <div key={i} className="border border-gray-100 rounded-2xl p-8 flex items-center justify-center min-h-[140px] bg-gray-50/50">
                                        <div className="text-gray-200 font-bold text-sm tracking-widest uppercase">Brand</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
