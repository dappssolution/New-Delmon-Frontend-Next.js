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
    Package,
} from "lucide-react";
import { useEffect, useState } from "react";
import { vendorApis } from "@/src/service/vendorApi";
import { DashboardStatsData, GetOrdersData } from "@/src/types/vendor.types";
import Link from "next/link";

export default function VendorDashboardPage() {
    const { user } = useAppSelector((state: RootState) => state.auth);
    const isActive = user?.status === "active";
    const [stats, setStats] = useState<DashboardStatsData | null>(null);
    const [recentOrders, setRecentOrders] = useState<GetOrdersData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isActive) return;
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    vendorApis.dashboardStats(),
                    vendorApis.getAllOrders()
                ]);

                if (statsRes.status) {
                    setStats(statsRes.data);
                }

                if (ordersRes.success) {
                    const sortedOrders = ordersRes.data.sort((a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    ).slice(0, 5);
                    setRecentOrders(sortedOrders);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [isActive]);

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "confirmed":
            case "processing":
            case "preparing":
                return "bg-blue-100 text-blue-700";
            case "delivered":
            case "ready":
                return "bg-green-100 text-green-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

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
                                <p className="text-2xl font-bold text-gray-900">AED {stats?.today_earnings || "0"}</p>
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
                                        strokeDashoffset={176 - (176 * Math.min(parseFloat(stats?.today_earnings_percent || "0"), 100)) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                                    {stats?.today_earnings_percent.includes('%') ? stats.today_earnings_percent : `${stats?.today_earnings_percent || "0"}%`}
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
                                <p className="text-2xl font-bold text-gray-900">AED {stats?.month_earnings || "0"}</p>
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
                                        strokeDashoffset={176 - (176 * Math.min(parseFloat(stats?.month_earnings_percent || "0"), 100)) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                                    {stats?.month_earnings_percent.includes('%') ? stats.month_earnings_percent : `${stats?.month_earnings_percent || "0"}%`}
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
                                <p className="text-2xl font-bold text-gray-900">AED {stats?.year_earnings || "0"}</p>
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
                                        strokeDashoffset={176 - (176 * Math.min(parseFloat(stats?.year_earnings_percent || "0"), 100)) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                                    {stats?.year_earnings_percent.includes('%') ? stats.year_earnings_percent : `${stats?.year_earnings_percent || "0"}%`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pending Order */}
                    <div className="bg-white rounded-xl border border-green-700 p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Pending Order</span>
                            <Package className="w-5 h-5 text-pink-500" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats?.pending_orders || "0"}</p>
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
                                        strokeDashoffset={176 - (176 * Math.min(parseFloat(stats?.pending_orders_percent || "0"), 100)) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                                    {stats?.pending_orders_percent.includes('%') ? stats.pending_orders_percent : `${stats?.pending_orders_percent || "0"}%`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-green-700 p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Earnings</p>
                            <p className="text-xl font-bold text-gray-900">AED {stats?.total_earnings || "0"}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-green-700 p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-xl font-bold text-gray-900">{stats?.total_orders || "0"}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-green-700 p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-xl font-bold text-gray-900">{stats?.total_products || "0"}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <Package className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                {/* Orders Summary */}
                <div className="bg-white rounded-xl border border-green-700 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                        <Link href="/vendor/vendor-orders" className="text-sm text-[#0d6838] font-medium hover:underline">
                            View All Orders
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Invoice No</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Amount</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">Loading orders...</td>
                                    </tr>
                                ) : recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">No recent orders found</td>
                                    </tr>
                                ) : recentOrders.map((order, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.invoice_no}</td>
                                        <td className="py-4 px-4 text-sm text-gray-700">{order.name}</td>
                                        <td className="py-4 px-4 text-sm text-gray-700">
                                            {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="py-4 px-4 text-sm font-medium text-gray-900">AED {order.amount}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/vendor/orders/${order.id}`}
                                                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <Settings className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Download Invoice">
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
