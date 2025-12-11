import React from 'react';
import PaginatedProducts from '../../../components/products/PaginatedProducts';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-[#0d6838] transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium">All Products</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">All Products</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
                <PaginatedProducts />
            </div>
        </div>
    );
}
