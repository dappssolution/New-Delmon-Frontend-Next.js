"use client";

import { RootState } from "@/src/redux/store";
import { useSelector } from "react-redux";
import { ShoppingBag, RotateCcw, Heart, Wallet } from "lucide-react";

export default function AccountDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);

  const stats = [
    { label: "Total Orders", value: "12", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Returns", value: "1", icon: RotateCcw, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Wishlist", value: "4", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Wallet Balance", value: "$340.00", icon: Wallet, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || "User"} 👋
        </h2>
        <p className="text-gray-500 mt-1">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-xl bg-linear-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-xl">
          <h3 className="text-xl font-bold mb-2">Summer Sale is Live!</h3>
          <p className="text-gray-300 mb-4">Get up to 50% off on your wishlist items. Check them out now before the stock runs out.</p>
          <button className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors">
            View Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
