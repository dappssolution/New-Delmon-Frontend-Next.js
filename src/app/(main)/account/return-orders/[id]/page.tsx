"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { OrderDetailsData } from '@/src/types/user.types';
import { getOrderDetails } from '@/src/service/userApi';

export default function ReturnOrderDetailsPage() {
    const [orderDetails, setOrderDetails] = useState<OrderDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
            setError(err.response?.data?.message || "Failed to fetch return order details");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
                <p className="text-red-600 mb-4">{error || "Return order not found"}</p>
                <button
                    onClick={() => router.push('/account/return-orders')}
                    className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition-colors"
                >
                    Back to Return Orders
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
                    onClick={() => router.push('/account/return-orders')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white shadow-sm border border-gray-100"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Return Details</h1>
                    <p className="text-sm text-gray-500 md:hidden">Invoice: {order.invoice_no}</p>
                </div>
            </div>

            {/* Top Stats/Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                        <p className="font-bold text-gray-900">{order.invoice_no}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Return Date</p>
                        <p className="font-bold text-gray-900">{formatDate(order.return_date)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment</p>
                        <p className="font-bold text-gray-900">{order.payment_method}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Refund Amount</p>
                        <p className="font-bold text-green-700">{order.currency} {order.amount.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Return Reason */}
            {order.return_reason && (
                <div className="bg-orange-50 rounded-2xl border border-orange-100 p-5 md:p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Return Reason
                    </h2>
                    <p className="text-sm text-orange-800 leading-relaxed">{order.return_reason}</p>
                </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                        Shipping Info
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-1">
                            <span className="text-gray-500">Receiver</span>
                            <span className="font-medium text-gray-900">{order.name}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-500">Phone</span>
                            <span className="font-medium text-gray-900">{order.phone}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium text-gray-900">{order.email}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-50">
                            <p className="text-gray-500 mb-1">Address</p>
                            <div className="font-medium text-gray-900">
                                {typeof order.address === 'object' ? (
                                    <>
                                        <p>{order.address.address}</p>
                                        <p>
                                            {[
                                                order.address.building_details,
                                                order.address.city,
                                                order.address.emirate_name || order.emirate?.name,
                                                order.address.country_name || order.country?.name
                                            ].filter(Boolean).join(', ')}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p>{order.address}</p>
                                        <p>
                                            {[
                                                order.emirate?.name,
                                                order.country?.name,
                                                order.post_code
                                            ].filter(Boolean).join(', ')}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Return Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                        Refund Summary
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal Items</span>
                            <span className="font-medium text-gray-900">{order.currency} {(order.amount - order.tax - order.shipping + order.coupon_amount).toFixed(2)}</span>
                        </div>
                        {order.tax > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tax</span>
                                <span className="font-medium text-gray-900">{order.currency} {order.tax.toFixed(2)}</span>
                            </div>
                        )}
                        {order.shipping > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-medium text-gray-900">{order.currency} {order.shipping.toFixed(2)}</span>
                            </div>
                        )}
                        {order.coupon_amount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span className="font-medium">-{order.currency} {order.coupon_amount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-4 border-t border-gray-100">
                            <span className="text-base font-bold text-gray-900">Total Refund</span>
                            <span className="text-xl font-bold text-green-700">{order.currency} {order.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm overflow-hidden">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                    Returned Items ({items.length})
                </h2>

                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 group hover:border-green-100 transition-colors">
                            <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
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
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{item.product?.product_name || 'N/A'}</h3>
                                    <span className="text-sm font-bold text-green-700 whitespace-nowrap">{order.currency} {item.subtotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Code: {item.product?.product_code || 'N/A'}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {item.size && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Size: {item.size}</span>}
                                    {item.color && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Color: {item.color}</span>}
                                    <span className="text-[10px] bg-green-50 px-1.5 py-0.5 rounded text-green-700 font-medium">Qty: {item.qty}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">{order.currency} {item.price.toFixed(2)} per unit</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer button */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={() => router.push('/account/return-orders')}
                    className="bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition-shadow hover:shadow-lg shadow-md flex items-center gap-2 font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to return list
                </button>
            </div>
        </div>
    );
}
