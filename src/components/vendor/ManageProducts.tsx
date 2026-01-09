"use client";

import React, { useEffect, useState } from 'react';
import { ChevronRight, Eye, Edit, Trash2, Search, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux';
import { RootState } from '@/src/redux/store';
import { fetchVendorProducts, deleteVendorProduct, updateVendorProduct } from '@/src/redux/vendor/vendorThunk';
import { AllProductData } from '@/src/types/vendor.types';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ManageProductPage() {
    const dispatch = useAppDispatch();
    const { products, loading, error, deleting, updating, pagination } = useAppSelector((state: RootState) => state.vendor);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        dispatch(fetchVendorProducts({
            page: currentPage,
            per_page: entriesPerPage,
            search: debouncedSearchTerm
        }));
    }, [dispatch, currentPage, entriesPerPage, debouncedSearchTerm]);

    const handleDelete = async (productId: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const resultAction = await dispatch(deleteVendorProduct(productId));
                if (deleteVendorProduct.fulfilled.match(resultAction)) {
                    toast.success("Product deleted successfully");
                } else {
                    toast.error(resultAction.payload as string || "Failed to delete product");
                }
            } catch (err) {
                toast.error("An error occurred while deleting the product");
            }
        }
    };

    const handleStatusToggle = async (product: AllProductData) => {
        const newStatus = Number(product.status) === 1 ? 0 : 1;
        const formData = new FormData();
        formData.append('status', newStatus.toString());

        try {
            const resultAction = await dispatch(updateVendorProduct({
                productId: product.id.toString(),
                productData: formData,
            }));

            if (updateVendorProduct.fulfilled.match(resultAction)) {
                toast.success(`Product ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`);
            }
        } catch (err) {
            toast.error("An error occurred while updating status");
        }
    };

    // Pagination logic
    const totalProducts = pagination?.total || 0;
    const totalPages = pagination?.lastPage || 1;
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalProducts);
    const currentProducts = products;

    // Calculate discount percentage
    const calculateDiscount = (product: AllProductData) => {
        if (product.discount_price && product.selling_price) {
            const discount = ((parseFloat(product.selling_price) - parseFloat(product.discount_price)) / parseFloat(product.selling_price)) * 100;
            return `${Math.round(discount)}%`;
        }
        return "0%";
    };



    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Delmon</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>Vendor Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#0d6838] font-medium">Manage Product</span>
                </div>
                <Link href="/vendor/add-product" className="px-4 py-2 bg-[#0d6838] text-white text-sm font-medium rounded-lg hover:bg-[#0a5229] transition-colors">
                    Add Product
                </Link>
            </div>

            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back !</h1>
                <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-green-700 shadow-sm">
                {/* Table Header Controls */}
                <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Show</label>
                        <select
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                            className="px-3 py-1.5 border text-gray-900 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <label className="text-sm text-gray-700">entries</label>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 text-gray-900 px-4 py-1.5 pr-10 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">SI</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Product Name</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Price</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Qty</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Discount</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-red-500">
                                        Error: {error}
                                    </td>
                                </tr>
                            ) : currentProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                currentProducts.map((product, index) => (
                                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-gray-900">#{startIndex + index + 1}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{product.product_name}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700">
                                            AED {product.discount_price || product.selling_price}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{product.product_qty}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{calculateDiscount(product)}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${Number(product.status) === 1
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {Number(product.status) === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/vendor/edit-product/${product.id}`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                <button
                                                    disabled={deleting === product.id.toString()}
                                                    onClick={() => handleDelete(product.id.toString())}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors border border-gray-300 disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deleting === product.id.toString() ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                    ) : (
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusToggle(product)}
                                                    disabled={updating === product.id.toString()}
                                                    className={`p-2 rounded-lg transition-colors border ${Number(product.status) === 1
                                                        ? 'border-green-200 hover:bg-green-50'
                                                        : 'border-red-200 hover:bg-red-50'
                                                        }`}
                                                    title={Number(product.status) === 1 ? "Deactivate" : "Activate"}
                                                >
                                                    {updating === product.id.toString() ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                                                    ) : Number(product.status) === 1 ? (
                                                        <ThumbsUp className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <ThumbsDown className="w-4 h-4 text-red-600" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {totalProducts === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, totalProducts)} of {totalProducts} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1.5 text-sm border text-gray-900 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            Prev
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${currentPage === page
                                    ? 'bg-[#0d6838] text-white'
                                    : 'border border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="px-3 py-1.5 text-sm border text-gray-900 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}