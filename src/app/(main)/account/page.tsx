"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { RootState } from "@/src/redux/store";
import SummaryCards from "@/src/components/account/SummaryCards";
import RecentOrders from "@/src/components/account/RecentOrders";
import { getDashboardData } from "@/src/service/userApi";
import { DashboardData } from "@/src/types/user.types";

export default function AccountDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardData();
      setData(res.data);
    } catch (err: any) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || "Something went wrong"}</p>
        <button
          onClick={fetchDashboard}
          className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition-colors font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-green-700">
          Welcome Back, {user?.name || "User"}
        </h2>
        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Manage your orders and account settings</p>
      </div>

      <SummaryCards data={{
        total_orders: data.total_orders,
        pending_orders: data.pending_orders,
        return_orders: data.return_orders,
        wishlist_count: data.wishlist_count
      }} />
      <RecentOrders orders={data.recent_orders} />
    </div>
  );
}
