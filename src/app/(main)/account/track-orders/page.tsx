"use client";

import React from 'react';
import FormInput from "@/src/components/common/FormInput";
import Button from "@/src/components/common/Button";
import { Package, Truck, CheckCircle } from "lucide-react";

export default function TrackOrdersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Track Order</h2>
                <p className="text-gray-500 text-sm mt-1">Enter your order ID to see the current status.</p>
            </div>

            <div className="max-w-xl p-6 border border-gray-200 rounded-xl bg-gray-50/50">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <FormInput name="orderId" label="Order ID" placeholder="e.g. ORD-12345" />
                    </div>
                    <Button className="w-full md:w-auto mb-px">Track</Button>
                </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Latest Order: #ORD-7234</h3>

                <div className="relative">
                    {/* Connector Line */}
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 -z-10" />

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 ring-4 ring-white">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Delivered</h4>
                                <p className="text-sm text-gray-500">Oct 24, 2024 at 2:30 PM</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 ring-4 ring-white">
                                <Truck className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Out for Delivery</h4>
                                <p className="text-sm text-gray-500">Oct 24, 2024 at 8:00 AM</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 ring-4 ring-white">
                                <Package className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Shipped</h4>
                                <p className="text-sm text-gray-500">Oct 22, 2024</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
