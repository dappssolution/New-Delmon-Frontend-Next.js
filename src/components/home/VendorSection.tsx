"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VendorCard from "../common/VendorCard";
import { homeApi } from "@/src/service/homeApi";
import { VendorGetData } from "@/src/types/home.types";

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
            <section className="py-8 md:py-12 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, idx) => (
                            <div key={idx} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (vendors.length === 0) return null;

    return (
        <section className="py-8 md:py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        All Our Vendor List
                    </h2>
                    <Link
                        href="/vendors"
                        className="px-4 md:px-6 py-2 md:py-2.5 text-green-800 rounded-md hover:text-green-900 transition-colors text-sm md:text-base font-medium"
                    >
                        View All
                    </Link>
                </div>

                {/* Vendor Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
