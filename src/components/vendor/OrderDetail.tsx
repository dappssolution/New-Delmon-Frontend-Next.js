"use client";

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux';
import { fetchOrderDetail, updateVendorOrderStatus } from '@/src/redux/vendor/vendorThunk';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderDetail() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { currentOrder, orderLoading, error, updatingStatus } = useAppSelector((state) => state.vendor);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderDetail(id as string));
        }
    }, [dispatch, id]);

    if (orderLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
                <Loader2 className="w-10 h-10 text-[#0d6838] animate-spin" />
                <p className="text-gray-500 font-medium">Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 max-w-md text-center">
                    <p className="font-bold mb-2">Error Loading Order</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
                <p className="text-gray-500 font-medium">Order not found.</p>
            </div>
        );
    }

    const { order, items } = currentOrder;

    // Calculate subtotal from items if not provided directly, or use a derived value
    const subtotal = items.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);

    return (
        <div className="max-w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>Delmon</span>
                <ChevronRight className="w-4 h-4" />
                <span>Vendor Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span>vendor order</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#0d6838] font-medium">View Order</span>
            </div>

            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back !</h1>
                <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            </div>

            {/* Order Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                    <p className="text-[#0d6838] font-semibold">{order.invoice_no}</p>
                </div>
                <div className="text-sm text-gray-600">
                    {new Date(order.order_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* Shipping and Order Details Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Shipping Details Card */}
                <div className="bg-white rounded-xl border border-green-700 shadow-sm p-6">
                    <h4 className="text-base font-bold text-gray-900 mb-4">Shipping Details</h4>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Name</span>
                            <span className="text-sm text-gray-900">{order.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Phone</span>
                            <span className="text-sm text-gray-900">{order.phone}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Email</span>
                            <span className="text-sm text-gray-900">{order.email}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Division</span>
                            <span className="text-sm text-gray-900">{order.division?.devision_name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">District</span>
                            <span className="text-sm text-gray-900">{order.district?.district_name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">State</span>
                            <span className="text-sm text-gray-900">{order.state?.state_name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Post code</span>
                            <span className="text-sm text-gray-900">{order.post_code}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Order date</span>
                            <span className="text-sm text-gray-900">{order.order_date}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2">
                            <span className="text-sm text-gray-700">Address</span>
                            <span className="text-sm text-gray-900">{order.address}</span>
                        </div>
                    </div>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-xl border border-green-700 shadow-sm p-6">
                    <h4 className="text-base font-bold text-gray-900 mb-4">Order Details</h4>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Name</span>
                            <span className="text-sm text-gray-900">{order.user?.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Phone</span>
                            <span className="text-sm text-gray-900">{order.user?.phone || order.phone}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Payment type</span>
                            <span className="text-sm text-gray-900">{order.payment_method}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Transaction id</span>
                            <span className="text-sm text-gray-900">{order.transaction_id || '-'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Invoice</span>
                            <span className="text-sm text-gray-900">{order.invoice_no}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Order amount</span>
                            <span className="text-sm text-gray-900">{order.currency} {order.amount}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Tax</span>
                            <span className="text-sm text-gray-900">{order.currency} {order.tax}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-700">Shipping</span>
                            <span className="text-sm text-gray-900">{order.currency} {order.shipping}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 items-center">
                            <span className="text-sm text-gray-700">Order status</span>
                            <div className="relative">
                                <select
                                    value={order.status}
                                    onChange={(e) => dispatch(updateVendorOrderStatus({ orderId: order.id.toString(), status: e.target.value }))}
                                    disabled={updatingStatus}
                                    className={`text-sm text-gray-900 font-medium bg-transparent border-b border-gray-300 focus:border-[#0d6838] focus:ring-0 w-full py-1 cursor-pointer disabled:opacity-50 ${updatingStatus ? 'animate-pulse' : ''}`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirm">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="picked_up">Picked Up</option>
                                    <option value="deliverd">Delivered</option>
                                    <option value="cancel">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items Table */}
            <div className="bg-white rounded-xl border border-green-700 shadow-sm p-6">
                <h4 className="text-base font-bold text-gray-900 mb-4">Order Items</h4>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Image</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Product name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Vendor name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Product code</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Size</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Color</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Quantity</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-4 px-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.product?.product_thambnail}`}
                                                alt={item.product?.product_name || 'Product Image'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-900">{item.product?.product_name}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{item.vendor_id || '-'}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{item.product?.product_code}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{item.size || item.product?.product_size || '-'}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{item.color || item.product?.product_color || '-'}</td>
                                    <td className="py-4 px-4 text-sm text-gray-700">{item.qty}</td>
                                    <td className="py-4 px-4 text-sm font-bold text-gray-900">{order.currency} {item.subtotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Subtotal */}
                <div className="mt-4 flex justify-end">
                    <div className="text-sm">
                        <span className="text-gray-700 font-medium">Subtotal : </span>
                        <span className="font-bold text-gray-900">{order.currency} {subtotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
