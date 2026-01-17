"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { getOrderDetails } from "@/src/service/userApi";
import { OrderDetailsData } from "@/src/types/user.types";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const [orderDetails, setOrderDetails] = useState<OrderDetailsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const data = await getOrderDetails(Number(orderId));
            if (data.status) {
                setOrderDetails(data.data);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const invoiceNo = orderDetails?.order?.invoice_no;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Success Icon */}
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been confirmed.
                </p>

                {/* Invoice ID */}
                {invoiceNo && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
                        <p className="text-sm text-gray-500 mb-1 font-medium">Invoice ID</p>
                        <p className="text-lg font-bold text-green-700">{invoiceNo}</p>
                    </div>
                )}

                {/* Info Message */}
                <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 mb-8 text-left">
                    <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-blue-800 font-medium mb-1">
                            What&apos;s next?
                        </p>
                        <p className="text-sm text-blue-700">
                            You will receive an email confirmation shortly. You can track your order status from your account.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href="/account/orders"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        View My Orders
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
