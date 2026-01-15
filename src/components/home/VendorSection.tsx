"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VendorCard from "../common/VendorCard";
import { homeApi } from "@/src/service/homeApi";
import { VendorGetData } from "@/src/types/home.types";
import { Store } from "lucide-react";

export default function VendorSection() {
    const [vendors, setVendors] = useState<VendorGetData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await homeApi.getVendors(3, 1); // Get only 3 vendors for home page
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
            <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
                        <div className="h-8 sm:h-9 w-48 sm:w-56 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-9 sm:h-10 w-full sm:w-28 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        {[...Array(3)].map((_, idx) => (
                            <div key={idx} className="bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="h-32 sm:h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                                <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-2.5 md:space-y-3">
                                    <div className="h-3 sm:h-3.5 bg-gray-200 rounded w-1/3 animate-pulse" />
                                    <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                                    <div className="h-8 sm:h-9 bg-gray-200 rounded-md sm:rounded-lg w-full animate-pulse mt-2 sm:mt-3 md:mt-4" />
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
        <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Decorations - Hidden on mobile */}
            <div className="hidden sm:block absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-green-100 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
            <div className="hidden sm:block absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-emerald-100 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
            
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
                {/* Enhanced Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <Store className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                                All Our Vendor List
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Discover quality products from trusted sellers</p>
                        </div>
                    </div>
                    
                    <Link
                        href="/vendors"
                        className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-green-700 rounded-lg sm:rounded-xl hover:bg-green-50 transition-all duration-300 text-xs sm:text-sm font-semibold border-2 border-green-200 hover:border-green-300 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md group w-full sm:w-fit"
                    >
                        <span>View All</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Vendor Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    {vendors.map((vendor) => (
                        <VendorCard
                            key={vendor.id}
                            id={vendor.id}
                            name={vendor.name}
                            username={vendor.username}
                            phone={vendor.phone}
                            vendor_join={vendor.vendor_join}
                            photo={vendor.photo}
                            productCount={0}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}