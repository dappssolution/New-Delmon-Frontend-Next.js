"use client";

import { useEffect, useState } from "react";
import VendorCard from "@/src/components/common/VendorCard";
import { homeApi } from "@/src/service/homeApi";
import { VendorGetData, Meta } from "@/src/types/home.types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function VendorsPage() {
    const [vendors, setVendors] = useState<VendorGetData[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchVendors(currentPage);
    }, [currentPage]);

    const fetchVendors = async (page: number) => {
        setLoading(true);
        try {
            const res = await homeApi.getVendors(10, page);
            setVendors(res.data || []);
            setMeta(res.meta || null);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* First Page */}
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

                {/* Page Numbers */}
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md border ${currentPage === page
                                ? "bg-green-700 text-white border-green-700"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Last Page */}
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

                {/* Next Button */}
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

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Vendor List
                    </h1>
                    {meta && (
                        <p className="text-gray-600">
                            Showing {meta.loaded} of {meta.total} vendors
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(10)].map((_, idx) => (
                            <div key={idx} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : vendors.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No vendors found</p>
                    </div>
                ) : (
                    <>
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

                        {/* Pagination */}
                        {renderPagination()}
                    </>
                )}
            </div>
        </div>
    );
}
