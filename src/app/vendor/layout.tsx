"use client";

import { useAppSelector } from "@/src/hooks/useRedux";
import { RootState } from "@/src/redux/store";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Search,
    Bell,
    Home,
    Package,
    ShoppingCart,
    MoreHorizontal,
    Menu,
    X,
    LogOut,
    User,
    ChevronDown
} from "lucide-react";
import Loading from "@/src/components/common/Loading";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/src/redux/auth/authSlice";
import { authApi } from "@/src/service/authApi";
import { useAppDispatch } from "@/src/hooks/useRedux";

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAppSelector((state: RootState) => state.auth);
    const { profile } = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        if (user && user.role !== "vendor") {
            router.push("/");
        }
    }, [user, router]);

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            dispatch(logout());
            router.push("/login");
        }
    };

    if (user && user.role !== "vendor") {
        return null;
    }

    if (!user) {
        return (
            <ProtectedRoute>
                <Loading fullScreen />
            </ProtectedRoute>
        );
    }

    console.log("phtoso ssssheree:", `${process.env.NEXT_PUBLIC_IMAGE_BASE}/upload/vendor_images/${profile?.photo}`);


    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:overflow-y-auto
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    {/* Logo Section */}
                    <div className="h-[73px] flex items-center justify-between px-14 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <div onClick={() => router.push('/')} className="cursor-pointer">
                            <Image
                                src="/delmon-logo-only.png"
                                alt="Delmon"
                                width={160}
                                height={80}
                                className="object-contain h-12 w-auto"
                                priority
                            />
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="p-4 space-y-1">
                        <Link
                            href="/vendor"
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${pathname === '/vendor'
                                ? 'bg-[#0d6838] text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Home className="w-5 h-5" />
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>

                        {user.status === 'active' && (
                            <>
                                <Link
                                    href="/vendor/manage-products"
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${pathname === '/vendor/manage-products'
                                        ? 'bg-[#0d6838] text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Package className="w-5 h-5" />
                                    <span className="text-sm font-medium">Manage Product</span>
                                </Link>

                                <Link
                                    href="/vendor/add-product"
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${pathname === '/vendor/add-product'
                                        ? 'bg-[#0d6838] text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-sm font-medium">Add Product</span>
                                </Link>

                                <Link
                                    href="/vendor/vendor-orders"
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${pathname === '/vendor/vendor-orders'
                                        ? 'bg-[#0d6838] text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="text-sm font-medium">Vendor Orders</span>
                                </Link>

                                <div className="pt-2 mt-2 border-t border-gray-100">
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                        <span className="text-sm font-medium">Return Options</span>
                                    </button>
                                    <div className="pl-4 mt-1 space-y-1">
                                        <Link
                                            href="/vendor/return-request"
                                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${pathname === '/vendor/return-request'
                                                ? 'text-[#0d6838] font-semibold bg-[#e6f0eb]'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span>→</span>
                                            <span>Return Request</span>
                                        </Link>
                                        <Link
                                            href="/vendor/complete-return"
                                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${pathname === '/vendor/complete-return'
                                                ? 'text-[#0d6838] font-semibold bg-[#e6f0eb]'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span>→</span>
                                            <span>Complete Return</span>
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </nav>
                </aside>

                {/* Main Content Wrapper */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Top Header */}
                    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between gap-4">
                                {/* Mobile Menu Trigger */}
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                                {/* Search */}
                                <div className="flex-1 max-w-xl">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search here..."
                                            className="w-full h-10 px-4 pr-10 bg-gray-50 border border-gray-300 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] transition-all"
                                        />
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Search className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex items-center gap-6 ml-4">
                                    <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <Bell className="w-5 h-5 text-gray-700" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition-opacity"
                                        >
                                            <div className="w-10 h-10 bg-[#e6f0eb] rounded-full flex items-center justify-center text-[#0d6838]">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/upload/vendor_images/${profile?.photo}`}
                                                    alt="Vendor"
                                                    width={40}
                                                    height={40}
                                                    className="object-cover rounded-full"
                                                />
                                            </div>
                                            <div className="hidden sm:flex flex-col items-start">
                                                <span className="text-sm font-semibold text-gray-900 leading-none">{user?.name}</span>
                                                <span className="text-[11px] text-gray-500 mt-1 capitalize">{user?.role}</span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 origin-top-right transition-all transform z-50">
                                                <Link
                                                    href="/vendor/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0d6838] transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-6 sm:p-8 overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}