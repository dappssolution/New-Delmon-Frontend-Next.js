'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux';
import { fetchVendorReturnOrders } from '@/src/redux/vendor/vendorThunk';
import { ChevronRight, Eye, Search } from 'lucide-react';
import Link from 'next/link';

export default function VendorReturnOrdersPage() {
    const dispatch = useAppDispatch();
    const { returnOrders, loading } = useAppSelector((state) => state.vendor);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 8;

    useEffect(() => {
        dispatch(fetchVendorReturnOrders());
    }, [dispatch]);

    const filteredOrders = returnOrders.filter((returnOrder) => {
        const term = searchTerm.toLowerCase();
        return (
            returnOrder.invoice_no?.toLowerCase().includes(term) ||
            returnOrder.name?.toLowerCase().includes(term) ||
            String(returnOrder.amount).includes(term) ||
            returnOrder.payment_method?.toLowerCase().includes(term) ||
            returnOrder.status?.toLowerCase().includes(term)
        );
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d6838]"></div>
            </div>
        )
    }

    return (
        <div className="max-w-full mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>Delmon</span>
                <ChevronRight className="w-4 h-4" />
                <span>Vendor Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#0d6838] font-medium">Return Request</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-xl font-bold text-gray-900">Return Orders</h1>

                    {/* Search */}
                    <div className="relative max-w-xs w-full">
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent transition-all"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SI</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Return Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Return Reason</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">State</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order, index) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                            {new Date(order.order_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                            {order.invoice_no}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                            ${Number(order.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                            {order.payment_method}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                            {order.return_date ? new Date(order.return_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700 truncate max-w-xs" title={order.return_reason}>
                                            {order.return_reason || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'cancel' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/vendor/order-details/${order.id}`}
                                                className="inline-flex items-center justify-center p-2 bg-[#0d6838] text-white rounded-lg hover:bg-green-900 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                        No return orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="text-sm text-gray-500">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === page
                                            ? 'bg-[#0d6838] text-white'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}