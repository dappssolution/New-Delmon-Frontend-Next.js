"use client";

import React from 'react';
import { RotateCcw, AlertCircle } from "lucide-react";
import Button from "@/src/components/common/Button";

const mockReturns = [
    {
        id: "#RET-2023",
        orderId: "ORD-7234",
        date: "Oct 26, 2024",
        status: "Approved",
        item: "Slim Fit Jeans",
        refundAmount: "$45.00",
        image: "https://images.unsplash.com/photo-1542272617-08f086303b94?w=100&q=80"
    }
];

export default function ReturnOrdersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Return Orders</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your returns and refunds.</p>
            </div>

            <div className="space-y-4">
                {mockReturns.length > 0 ? (
                    mockReturns.map((ret) => (
                        <div key={ret.id} className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-sm transition-shadow">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                                    <img src={ret.image} alt="Product" className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <h3 className="font-semibold text-gray-900">{ret.item}</h3>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 w-fit">
                                            {ret.status}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>Return ID: {ret.id} • Order ID: {ret.orderId}</p>
                                        <p>Requested on: {ret.date}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-50">
                                        <p className="text-sm font-medium text-gray-900">Refund Amount: {ret.refundAmount}</p>
                                        <Button variant="outline" className="text-sm py-1.5 h-auto">
                                            View Status
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No returns yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">If you need to return an item, go to your Orders page and select the item you wish to return.</p>
                    </div>
                )}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-blue-900">Return Policy</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        You can return most items within 30 days of delivery for a full refund.
                        Items must be in original condition.
                    </p>
                </div>
            </div>
        </div>
    );
}
