"use client";

import React, { useEffect, useState } from 'react';
import { Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReturnOrderData } from '@/src/types/user.types';
import { getReturnOrders } from '@/src/service/userApi';

export default function ReturnOrdersPage() {
    const [returnOrders, setReturnOrders] = useState<ReturnOrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchReturnOrders();
    }, []);

    const fetchReturnOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getReturnOrders();
            setReturnOrders(response.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch return orders");
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (orderId: number) => {
        router.push(`/account/return-orders/${orderId}`);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={fetchReturnOrders}
                    className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'deliverd':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'returned':
                return 'bg-green-100 text-green-800';
            case 'requested':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {returnOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No return orders found
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="block lg:hidden space-y-4">
                        {returnOrders.map((order, index) => (
                            <div
                                key={order.id}
                                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleViewOrder(order.id)}
                                        className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                        title="View Return Order Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Invoice</span>
                                        <span className="text-sm font-medium text-gray-900">{order.invoice_no}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Date</span>
                                        <span className="text-sm text-gray-700">{formatDate(order.return_date)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Total</span>
                                        <span className="text-sm font-semibold text-gray-900">{order.currency} {order.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Payment</span>
                                        <span className="text-sm text-gray-700">{order.payment_method}</span>
                                    </div>
                                    {order.return_reason && (
                                        <div className="pt-2 border-t border-gray-100">
                                            <span className="text-sm text-gray-500">Reason: </span>
                                            <span className="text-sm text-gray-700">{order.return_reason}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">SL</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returnOrders.map((order, index) => (
                                    <tr key={order.id} className="border-b border-gray-200 last:border-0">
                                        <td className="px-6 py-4 text-sm text-gray-700">#{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{formatDate(order.return_date)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{order.currency} {order.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{order.payment_method}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{order.invoice_no}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <span className="line-clamp-1" title={order.return_reason}>
                                                {order.return_reason || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <button
                                                onClick={() => handleViewOrder(order.id)}
                                                className="hover:text-green-600 transition-colors"
                                                title="View Return Order Details"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}