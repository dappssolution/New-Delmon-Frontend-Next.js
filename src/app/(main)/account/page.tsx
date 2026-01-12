"use client";

import { useSelector } from "react-redux";
import { ShoppingBag, RotateCcw, Heart, Wallet } from "lucide-react";
import { RootState } from "@/src/redux/store";

export default function AccountDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);

  const stats = [
    { label: "Total Orders", value: "12", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Returns", value: "1", icon: RotateCcw, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Wishlist", value: "4", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Wallet Balance", value: "$340.00", icon: Wallet, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-green-700">
          Welcome Back, {user?.name || "User"}
        </h2>
        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Manage your orders and account settings</p>
      </div>
    </div>
  );
}
