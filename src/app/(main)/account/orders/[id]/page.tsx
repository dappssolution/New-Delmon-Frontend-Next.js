"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { OrderDetailsData } from '@/src/types/user.types';
import { getOrderDetails, returnOrder } from '@/src/service/userApi';
import { toast } from 'sonner';
import { AlertCircle, X } from 'lucide-react';

export default function OrderDetailsPage() {
    const [orderDetails, setOrderDetails] = useState<OrderDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getOrderDetails(Number(orderId));
            setOrderDetails(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    const handleReturnSubmit = async () => {
        if (!returnReason.trim()) {
            toast.error("Please provide a reason for return");
            return;
        }

        try {
            setIsSubmittingReturn(true);
            const response = await returnOrder(Number(orderId), returnReason);
            if (response.status) {
                toast.success("Return request submitted successfully");
                setShowReturnModal(false);
                fetchOrderDetails();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmittingReturn(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            </div>
        );
    }

    if (error || !orderDetails) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error || "Order not found"}</p>
                <button
                    onClick={() => router.push('/account/orders')}
                    className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition-colors"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    const { order, items } = orderDetails;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 md:mb-6">
                <button
                    onClick={() => router.push('/account/orders')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm border border-gray-100"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Order Details</h1>
                    <p className="text-sm text-gray-500 md:hidden">Invoice: {order.invoice_no}</p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                        Shipping Details
                    </h2>
                    <div className="space-y-1">
                        {[
                            { label: "Name", value: order.name },
                            { label: "Phone", value: order.phone },
                            { label: "Email", value: order.email },
                            { label: "Country", value: typeof order.address === 'object' ? order.address.country_name : order.country?.name },
                            { label: "Emirate", value: typeof order.address === 'object' ? order.address.emirate_name : order.emirate?.name },
                            { label: "Post code", value: order.post_code },
                            { label: "Order date", value: formatDate(order.order_date) },
                        ].map((detail, idx) => (
                            <div key={idx} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                                <span className="text-sm text-gray-500">{detail.label}</span>
                                <span className="text-sm font-medium text-gray-900 text-right">{detail.value || 'N/A'}</span>
                            </div>
                        ))}
                        <div className="flex flex-col py-2.5">
                            <span className="text-sm text-gray-500 mb-1">Address</span>
                            <span className="text-sm font-medium text-gray-900">
                                {typeof order.address === 'object' ? order.address.address : order.address}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                        Order Summary
                    </h2>
                    <div className="space-y-1">
                        {[
                            { label: "Invoice", value: order.invoice_no, highlight: true },
                            { label: "Payment type", value: order.payment_method },
                            { label: "Transaction id", value: order.transaction_id },
                            { label: "Order amount", value: `${order.currency} ${(order.amount - order.tax - order.shipping + order.coupon_amount).toFixed(2)}` },
                            { label: "Tax", value: `${order.currency} ${order.tax.toFixed(2)}` },
                            { label: "Shipping", value: `${order.currency} ${order.shipping.toFixed(2)}` },
                        ].map((detail, idx) => (
                            <div key={idx} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0 text-sm">
                                <span className="text-gray-500">{detail.label}</span>
                                <span className={`font-medium ${detail.highlight ? 'text-green-700 font-bold' : 'text-gray-900'}`}>{detail.value || 'N/A'}</span>
                            </div>
                        ))}
                        <div className="flex justify-between py-3 border-t border-gray-100 mt-2">
                            <span className="font-bold text-gray-900">Total Amount</span>
                            <span className="text-lg font-bold text-green-700">{order.currency} {order.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        order.status.includes('return') ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>

                            {order.status === 'deliverd' && order.order_return === '0' && (
                                <button
                                    onClick={() => setShowReturnModal(true)}
                                    className="text-xs font-semibold bg-red-600 text-white hover:bg-red-700 px-2 py-1 rounded"
                                >
                                    Return Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                    Ordered Items ({items.length})
                </h2>

                {/* Mobile Items View */}
                <div className="md:hidden space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-gray-100">
                            <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                {item.product?.product_thambnail ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.product.product_thambnail}`}
                                        alt={item.product?.product_name || "Product"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-8 h-8 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{item.product?.product_name || 'N/A'}</h3>
                                <p className="text-xs text-gray-500 mt-1">Code: {item.product?.product_code || 'N/A'}</p>
                                <div className="flex gap-3 mt-2">
                                    {item.size && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Size: {item.size}</span>}
                                    {item.color && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Color: {item.color}</span>}
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-600">Qty: {item.qty}</span>
                                    <span className="text-sm font-bold text-green-700">{order.currency} {item.subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Items Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 px-2 text-sm font-bold text-gray-700">Product</th>
                                <th className="text-left py-4 px-2 text-sm font-bold text-gray-700">Code</th>
                                <th className="text-left py-4 px-2 text-sm font-bold text-gray-700">Size/Color</th>
                                <th className="text-center py-4 px-2 text-sm font-bold text-gray-700">Quantity</th>
                                <th className="text-right py-4 px-2 text-sm font-bold text-gray-700">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.map((item) => (
                                <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                                {item.product?.product_thambnail ? (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.product.product_thambnail}`}
                                                        alt={item.product?.product_name || "Product"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 max-w-[200px] line-clamp-2">{item.product?.product_name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-sm text-gray-600">{item.product?.product_code || 'N/A'}</td>
                                    <td className="py-4 px-2 text-sm text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            {item.size && <span>Size: {item.size}</span>}
                                            {item.color && <span>Color: {item.color}</span>}
                                            {!item.size && !item.color && <span>-</span>}
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-sm text-center font-medium text-gray-900">{item.qty}</td>
                                    <td className="py-4 px-2 text-sm font-bold text-green-700 text-right">{order.currency} {item.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Subtotal Desktop */}
                <div className="hidden md:flex justify-end mt-8 pt-6 border-t border-gray-100">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-900">{order.currency} {order.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Tax</span>
                            <span className="font-medium text-gray-900">{order.currency} {order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span className="font-medium text-gray-900">{order.currency} {order.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-gray-100">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-green-700">{order.currency} {order.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Return Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                Return Request
                            </div>
                            <button
                                onClick={() => setShowReturnModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Please let us know the reason why you want to return this order.
                            </p>
                            <textarea
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                placeholder="Write your reason here..."
                                className="w-full h-32 text-gray-900 p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                            ></textarea>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button
                                    onClick={() => setShowReturnModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReturnSubmit}
                                    disabled={isSubmittingReturn}
                                    className="px-4 py-2.5 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmittingReturn ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Return"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}