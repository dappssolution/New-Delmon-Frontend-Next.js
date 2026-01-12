"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  RotateCcw,
  MapPin,
  User,
  Lock,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { logout } from "@/src/redux/auth/authSlice";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

const menu = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Return Orders", href: "/account/return-orders", icon: RotateCcw },
  { label: "Track Orders", href: "/account/track-orders", icon: MapPin },
  { label: "Account Details", href: "/account/details", icon: User },
  { label: "Change Password", href: "/account/change-password", icon: Lock },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Get current page label for mobile header
  const currentPage = menu.find(item => item.href === pathname)?.label || "Dashboard";

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen">
        <div className="max-w-[1400px] mx-auto bg-white px-4 sm:px-6 py-6 md:py-12">
          {/* Breadcrumb - Hidden on mobile */}
          <div className="hidden sm:block mb-6 text-sm text-gray-500">
            <span>Delmon</span>
            <span className="mx-2">{'>'}</span>
            <span>Home</span>
            <span className="mx-2">{'>'}</span>
            <span>User Dashboard</span>
          </div>

          {/* Mobile Header with Menu Toggle */}
          <div className="md:hidden mb-8 mt-2">
            <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900 leading-tight">{currentPage}</h1>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Account Menu</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 hover:bg-green-700 hover:text-white transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Slide-in Menu */}
          <div className={`
            fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:hidden shadow-2xl
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {menu.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                      ? "bg-green-700 text-white shadow-lg shadow-green-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-gray-50">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </nav>
          </div>

          <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
            {/* Desktop Sidebar - Hidden on mobile */}
            <aside className="hidden md:block">
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
                  <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-gray-900">Dashboard</h2>
                </div>
                <nav className="p-3">
                  {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${isActive
                          ? "bg-green-700 text-white shadow-lg shadow-green-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                          }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}

                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut className="w-5 h-5 shrink-0" />
                      Logout
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <section className="min-h-[400px] md:min-h-[500px]">
              {children}
            </section>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}