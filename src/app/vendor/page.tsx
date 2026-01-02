"use client";

import { useAppSelector } from "@/src/hooks/useRedux";
import { RootState } from "@/src/redux/store";
import {
    ShoppingCart,
    DollarSign,
    Users,
    ChevronRight,
    Settings,
    Download,
} from "lucide-react";

export default function VendorDashboardPage() {
    const { user } = useAppSelector((state: RootState) => state.auth);
    const isActive = user?.status === "active";

    const orders = [
        {
            id: "#54791",
            product: "Light Blue Chair",
            customer: "Anna",
            date: "12 jul 2020",
            price: "$ 567",
            status: "In Progress",
            statusColor: "bg-blue-100 text-blue-700",
        },
        {
            id: "#54791",
            product: "Sneakers",
            customer: "Sara Thomas",
            date: "12 Aug 2024",
            price: "$ 567",
            status: "Completed",
            statusColor: "bg-green-100 text-green-700",
        },
        {
            id: "#54791",
            product: "Mobile Phone",
            customer: "Alan Aik",
            date: "12 Dec 2026",
            price: "$ 567",
            status: "Cancelled",
            statusColor: "bg-red-100 text-red-700",
        },
    ];

    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>Delmon</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#0d6838] font-medium">Vendor Dashboard</span>
            </div>

            {/* Welcome Message */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back, {user?.name}!</h1>
                <h2 className="text-xl font-semibold text-[#0d6838]">Dashboard</h2>
            </div>

            {/* Account Status Alert */}
            {!isActive && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <h3 className="text-gray-900 font-bold text-lg">Vendor Account is Inactive</h3>
                    </div>
                    <p className="text-red-700">Please wait while our administrator reviews and approves your account. You will have full access to your dashboard once approved.</p>
                </div>
            )}

            {/* Overlay/Disabled state for inactive users */}
            <div className={`transition-all duration-300 ${!isActive ? 'opacity-40 pointer-events-none grayscale-[0.5]' : ''}`}>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Today's Sale */}
                    <div className="bg-white rounded-xl border border-green-700 p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Today's Sale</span>
                            <ShoppingCart className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">AED 0</p>
                            </div>
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="#3b82f6"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeDasharray="176"
                                        strokeDashoffset="170"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                                    +4.2%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Sale */}
                    <div className="bg-white rounded-xl border border-green-700 p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Monthly Sale</span>
                            <DollarSign className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">AED 647.92</p>
                            </div>
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="#f97316"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeDasharray="176"
                                        strokeDashoffset="174"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                                    +1.2%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Yearly Sale */}
                    <div className="bg-white rounded-xl border border-green-700 p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Yearly Sale</span>
                            <Users className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">AED 30157.51</p>
                            </div>
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="#dc2626"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeDasharray="176"
                                        strokeDashoffset="167"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                                    +5.2%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pending Order */}
                    <div className="bg-white rounded-xl border border-green-700 p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Pending Order</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">7</p>
                            </div>
                            <div className="relative w-16 h-16">
                                <svg className="w-16 h-16 transform -rotate-90">
                                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="#ec4899"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeDasharray="176"
                                        strokeDashoffset="172"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                                    +2.2%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Summary */}
                <div className="bg-white rounded-xl border border-green-700 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Orders Summary</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Order id</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Price</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 text-sm text-gray-900">{order.id}</td>
                                        <td className="py-4 px-4 text-sm text-gray-700">{order.product}</td>
                                        <td className="py-4 px-4 text-sm text-gray-700">{order.customer}</td>
                                        <td className="py-4 px-4 text-sm text-gray-700">{order.date}</td>
                                        <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.price}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Settings">
                                                    <Settings className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Download">
                                                    <Download className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
