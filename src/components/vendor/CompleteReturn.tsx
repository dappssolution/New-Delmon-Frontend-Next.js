"use client";

import React, { useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';

export default function CompleteReturnPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    // Empty array for now - shows "No data available in the table"
    const completeReturns: any[] = [];

    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>Delmon</span>
                <ChevronRight className="w-4 h-4" />
                <span>Vendor Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#0d6838] font-medium">Complete Return</span>
            </div>

            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back !</h1>
                <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            </div>

            {/* Complete Returns Table */}
            <div className="bg-white rounded-xl border border-green-700 shadow-sm">
                {/* Table Header Controls */}
                <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Show</label>
                        <select
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
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
                            className="w-full sm:w-64 px-4 py-1.5 pr-10 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
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
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Reason</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completeReturns.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                                        No data available in the table
                                    </td>
                                </tr>
                            ) : (
                                completeReturns.map((returnItem, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 text-sm text-gray-900">#{returnItem.id}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{returnItem.orderDate}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{returnItem.name}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{returnItem.invoice}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{returnItem.payment}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{returnItem.reason}</td>
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-4 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                {returnItem.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                                                title="View Details"
                                            >
                                                <svg
                                                    className="w-4 h-4 text-gray-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                    />
                                                </svg>
                                            </button>
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
                        Showing 0 to 0 of 0 entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                        >
                            Prev
                        </button>
                        <button
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}