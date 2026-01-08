"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchProductList from '../../../components/products/SearchProductList';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-[#0d6838] transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium">Search Results</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium">{query}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
                        Search Results for "{query}"
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
                <SearchProductList query={query} />
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
