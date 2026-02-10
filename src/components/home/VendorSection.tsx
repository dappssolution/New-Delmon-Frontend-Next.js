"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { homeApi } from "@/src/service/homeApi";
import { VendorGetData } from "@/src/types/home.types";
import { ArrowRight, Phone, Calendar } from "lucide-react";

// Card background colors matching the design reference
const cardColors = [
    {
        bgGradient: "from-[#f5efe6] to-[#ebe5db]", // Beige/cream
        badge: "bg-[#e8dfd3]",
    },
    {
        bgGradient: "from-[#fce8ec] to-[#f8dce2]", // Soft pink
        badge: "bg-[#f0d4db]",
    },
    {
        bgGradient: "from-[#e8edf5] to-[#dfe5f0]", // Lavender/light blue
        badge: "bg-[#d5dce9]",
    },
];

export default function VendorSection() {
    const [vendors, setVendors] = useState<VendorGetData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await homeApi.getVendors(3, 1);
                setVendors(res.data || []);
            } catch (error) {
                console.error("Error fetching vendors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    if (loading) {
        return (
            <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-white">
                <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        {[...Array(3)].map((_, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl sm:rounded-2xl overflow-hidden animate-pulse"
                                style={{
                                    backgroundColor: idx === 0 ? "#f5efe6" : idx === 1 ? "#fce8ec" : "#e8edf5"
                                }}
                            >
                                <div className="flex p-4 sm:p-5 md:p-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 bg-gray-200/50 rounded w-16" />
                                        <div className="h-5 bg-gray-200/50 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200/50 rounded w-1/2" />
                                        <div className="h-9 bg-gray-200/50 rounded-full w-28 mt-4" />
                                    </div>
                                    <div className="w-24 sm:w-28 md:w-32 lg:w-36 bg-gray-200/30 rounded-lg h-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (vendors.length === 0) return null;

    return (
        <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6">
                {/* Section Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Vendors List</h2>

                {/* Grid with auto-fit rows to match tallest card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 auto-rows-fr">
                    {vendors.map((vendor, index) => {
                        const colorScheme = cardColors[index % cardColors.length];

                        return (
                            <Link
                                key={vendor.id}
                                href={`/vendor/${vendor.id}`}
                                className={`group relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br ${colorScheme.bgGradient} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer flex flex-col`}
                            >
                                {/* Year Badge - Top Left */}
                                {vendor.vendor_join && (
                                    <div className={`absolute top-3 left-3 sm:top-4 sm:left-4 ${colorScheme.badge} px-2 py-1 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 z-20`}>
                                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
                                        <span className="text-[10px] sm:text-xs font-medium text-gray-700">
                                            Since {new Date(vendor.vendor_join).getFullYear()}
                                        </span>
                                    </div>
                                )}

                                {/* Main Content Area */}
                                <div className="flex-1 flex p-4 sm:p-5 md:p-6 pt-10 sm:pt-12 md:pt-14">
                                    {/* Left side - Text Content from API */}
                                    <div className="flex-1 flex flex-col pr-3 sm:pr-4 z-10">
                                        {/* Top content - grows to fill space */}
                                        <div className="flex-1">
                                            {/* Vendor Name from API */}
                                            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 leading-tight mb-1.5 sm:mb-2 line-clamp-2">
                                                {vendor.name}
                                            </h3>

                                            {/* Vendor Short Info from API */}
                                            {vendor.vendor_short_info && (
                                                <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 line-clamp-2 leading-relaxed">
                                                    {vendor.vendor_short_info}
                                                </p>
                                            )}

                                            {/* Vendor Phone from API */}
                                            {vendor.phone && (
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#006d5b]" />
                                                    <span className="text-xs sm:text-sm text-gray-600 font-medium">
                                                        {vendor.phone}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Store Button - mt-auto pushes to bottom */}
                                        <div className="mt-auto pt-3 sm:pt-4">
                                            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#006d5b] hover:bg-[#005a4a] text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg group-hover:gap-2 sm:group-hover:gap-2.5">
                                                <span className="sm:hidden">Store</span>
                                                <span className="hidden sm:inline">Visit Store</span>
                                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side - Vendor Image from API */}
                                    <div className="relative w-24 sm:w-28 md:w-32 lg:w-40 flex items-end justify-center flex-shrink-0">
                                        {vendor.photo ? (
                                            <div className="relative w-full h-20 sm:h-24 md:h-28">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/upload/vendor_images/${vendor.photo}`}
                                                    alt={vendor.name}
                                                    fill
                                                    className="object-contain object-bottom drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 160px"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-20 sm:h-24 md:h-28 flex items-center justify-center">
                                                <Image
                                                    src="/delmon-logo-only.png"
                                                    alt={vendor.name}
                                                    width={80}
                                                    height={80}
                                                    style={{ height: "auto" }}
                                                    className="object-contain opacity-50 group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -bottom-10 -right-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/15 pointer-events-none" />
                                <div className="absolute -bottom-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 pointer-events-none" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}