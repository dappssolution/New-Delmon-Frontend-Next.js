"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");

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

                {/* Order ID */}
                {orderId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                        <p className="text-lg font-semibold text-gray-900">#{orderId}</p>
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
