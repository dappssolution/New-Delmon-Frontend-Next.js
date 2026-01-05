"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { OrderDetailsData } from '@/src/types/user.types';
import { getOrderDetails } from '@/src/service/userApi';

export default function OrderDetailsPage() {
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
            setError(err.response?.data?.message || "Failed to fetch order details");
        } finally {
            setLoading(false);
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
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.push('/account/orders')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Name</span>
                            <span className="font-medium text-gray-900">{order.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Phone</span>
                            <span className="font-medium text-gray-900">{order.phone}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium text-gray-900">{order.email}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Division</span>
                            <span className="font-medium text-gray-900">{order.division?.division_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">District</span>
                            <span className="font-medium text-gray-900">{order.district?.district_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">State</span>
                            <span className="font-medium text-gray-900">{order.state?.state_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Post code</span>
                            <span className="font-medium text-gray-900">{order.post_code}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Order date</span>
                            <span className="font-medium text-gray-900">{formatDate(order.order_date)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Address</span>
                            <span className="font-medium text-gray-900 text-right">{order.address}</span>
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Name</span>
                            <span className="font-medium text-gray-900">{order.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Phone</span>
                            <span className="font-medium text-gray-900">{order.phone}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Payment type</span>
                            <span className="font-medium text-gray-900">{order.payment_method}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Transaction id</span>
                            <span className="font-medium text-gray-900">{order.transaction_id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Invoice</span>
                            <span className="font-medium text-gray-900">{order.invoice_no}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Order amount</span>
                            <span className="font-medium text-gray-900">{order.currency} {(order.amount - order.tax - order.shipping + order.coupon_amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium text-gray-900">{order.currency} {order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium text-gray-900">{order.currency} {order.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Order status</span>
                            <span className="font-medium text-gray-900">{order.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                
                {/* Table Header */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Image</th>
                                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Product name</th>
                                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Vendor name</th>
                                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Product code</th>
                                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Size</th>
                                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Color</th>
                                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Quantity</th>
                                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                    <td className="py-4 px-2">
                                        <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                            {item.product?.product_thambnail ? (
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.product.product_thambnail}`}
                                                    alt={item.product?.product_name || "Product"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-sm text-gray-900">{item.product?.product_name || 'N/A'}</td>
                                    {/* <td className="py-4 px-2 text-sm text-gray-900">{item.product?.vendor?.name || 'N/A'}</td> */}
                                    <td className="py-4 px-2 text-sm text-gray-900">{item.product?.product_code || 'N/A'}</td>
                                    <td className="py-4 px-2 text-sm text-gray-900">{item.size || '-'}</td>
                                    <td className="py-4 px-2 text-sm text-gray-900">{item.color || '-'}</td>
                                    <td className="py-4 px-2 text-sm text-gray-900">{item.qty}</td>
                                    <td className="py-4 px-2 text-sm font-semibold text-gray-900">{order.currency} {item.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Subtotal */}
                <div className="flex justify-end mt-6 pt-4 border-t-2 border-gray-200">
                    <div className="text-right">
                        <span className="text-gray-600 mr-4">Subtotal :</span>
                        <span className="text-lg font-bold text-gray-900">{order.currency} {order.amount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}