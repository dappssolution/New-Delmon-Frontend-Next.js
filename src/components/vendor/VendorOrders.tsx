"use client";

import React, { useEffect, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux';
import { fetchVendorOrders } from '@/src/redux/vendor/vendorThunk';
import Link from 'next/link';

export default function VendorOrdersPage() {
    const dispatch = useAppDispatch();
    const { orders, orderLoading, error } = useAppSelector((state) => state.vendor);

    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchVendorOrders());
    }, [dispatch]);

    // Filtering logic
    const filteredOrders = orders.filter(order =>
        order.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset to page 1 when search or entries per page change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, entriesPerPage]);

    // Pagination constants
    const totalEntries = filteredOrders.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + entriesPerPage);

    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>Delmon</span>
                <ChevronRight className="w-4 h-4" />
                <span>Vendor Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#0d6838] font-medium">vendor orders</span>
            </div>

            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back !</h1>
                <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-green-700 shadow-sm">
                {/* Table Header Controls */}
                <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Show</label>
                        <select
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                            className="px-3 py-1.5 text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
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
                            className="w-full text-gray-900 sm:w-64 px-4 py-1.5 pr-10 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
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
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Order Date</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Name</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Invoice</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Payment</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-4 px-6 text-center text-sm text-gray-600">Loading orders...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="py-4 px-6 text-center text-sm text-red-600">{error}</td>
                                </tr>
                            ) : currentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-4 px-6 text-center text-sm text-gray-600">No orders found</td>
                                </tr>
                            ) : (
                                currentOrders.map((order, index) => (
                                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm font-semibold text-gray-900">#{startIndex + index + 1}</td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-700">
                                            {new Date(order.order_date).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{order.name}</td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-700">{order.invoice_no}</td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-700">{order.payment_method}</td>
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Link
                                                href={`/vendor/order-details/${order.id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 hover:bg-green-900 rounded-lg transition-colors bg-[#0d6838] text-white"
                                                title="View Details"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            </Link>
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
                        {orderLoading ? (
                            "Loading..."
                        ) : filteredOrders.length > 0 ? (
                            `Showing ${startIndex + 1} to ${Math.min(startIndex + entriesPerPage, totalEntries)} of ${totalEntries} entries`
                        ) : (
                            "No entries found"
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${currentPage === page
                                    ? 'bg-[#0d6838] text-white'
                                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}