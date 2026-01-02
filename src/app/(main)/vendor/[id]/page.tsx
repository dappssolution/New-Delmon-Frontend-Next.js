"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { homeApi } from "@/src/service/homeApi";
import { VendorDetailedResponse, Vendor } from "@/src/types/vendor.types";
import { ProductData, Category } from "@/src/types/product.types";
import ProductCard from "@/src/components/common/ProductCard";
import { Mail, MapPin, Phone, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function VendorDetailPage() {
    const params = useParams();
    const vendorId = params.id as string;

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        fetchVendorData();
    }, [vendorId, currentPage, selectedCategory]);

    const fetchVendorData = async () => {
        setLoading(true);
        try {
            const res: VendorDetailedResponse = await homeApi.getVendorById(vendorId);
            setVendor(res.data.vendor);
            setProducts(res.data.products || []);
            setCategories(res.data.category_data || []);
            setMeta(res.meta);
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 400, behavior: "smooth" });
    };

    const renderPagination = () => {
        if (!meta || meta.last_page <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(meta.last_page, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={20} />
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md border ${
                            currentPage === page
                                ? "bg-green-700 text-white border-green-700"
                                : "border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < meta.last_page && (
                    <>
                        {endPage < meta.last_page - 1 && <span className="px-2">...</span>}
                        <button
                            onClick={() => handlePageChange(meta.last_page)}
                            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                            {meta.last_page}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === meta.last_page}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
                    <div className="h-64 bg-gray-100 rounded-2xl animate-pulse mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, idx) => (
                            <div key={idx} className="h-80 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
                    <p className="text-gray-600 mb-4">The vendor you're looking for doesn't exist.</p>
                    <Link href="/vendors" className="text-green-700 hover:text-green-800 font-medium">
                        ← Back to Vendors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
                {/* Vendor Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    {/* Banner with gradient */}
                    <div className="bg-linear-to-r from-[#5fae87] to-[#4a9b70] h-32 md:h-40 relative">
                        <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-8">
                            {vendor.photo ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${vendor.photo}`}
                                    alt={vendor.name}
                                    width={120}
                                    height={120}
                                    className="rounded-full border-4 border-white object-cover w-24 h-24 md:w-32 md:h-32"
                                />
                            ) : (
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white flex items-center justify-center">
                                    <Image
                                        src="/delmon white.png"
                                        alt={vendor.name}
                                        width={80}
                                        height={50}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="pt-16 md:pt-20 px-6 md:px-8 pb-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    {vendor.name}
                                </h1>
                                <p className="text-gray-600 mb-4">@{vendor.username}</p>
                                
                                {vendor.vendor_short_info && (
                                    <p className="text-gray-700 mb-4">{vendor.vendor_short_info}</p>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone size={16} className="text-green-700" />
                                        <span>{vendor.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail size={16} className="text-green-700" />
                                        <span>{vendor.email}</span>
                                    </div>
                                    {vendor.address && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin size={16} className="text-green-700" />
                                            <span>{vendor.address}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={16} className="text-green-700" />
                                        <span>Joined {new Date(vendor.vendor_join).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end gap-2">
                                <div className="bg-green-50 px-4 py-2 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Products</p>
                                    <p className="text-2xl font-bold text-green-700">{meta?.total || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedCategory === null
                                        ? "bg-green-700 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                All Products
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        selectedCategory === category.id
                                            ? "bg-green-700 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category.category_name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Products {meta && `(${meta.total})`}
                    </h2>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">No products found</p>
                    </div>
                ) : (
                    <>
                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={{
                                        id: product.id,
                                        slug: product.product_slug,
                                        category: product.category_name || "",
                                        title: product.product_name,
                                        price: product.selling_price,
                                        oldPrice: product.discount_price || undefined,
                                        image: product.product_thambnail,
                                        discount: product.discount_price ? `${Math.round(((parseFloat(product.discount_price) - parseFloat(product.selling_price)) / parseFloat(product.discount_price)) * 100)}%` : undefined,
                                        badge: product.product_qty === "0" ? "Out of Stock" : undefined,
                                        colors: product.product_color ? JSON.parse(product.product_color) : undefined,
                                        sizes: product.product_size ? JSON.parse(product.product_size) : undefined,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {renderPagination()}
                    </>
                )}
            </div>
        </div>
    );
}
