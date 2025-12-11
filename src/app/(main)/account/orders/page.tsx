"use client";

import React from 'react';
import { Package, ChevronRight } from "lucide-react";
import Button from "@/src/components/common/Button";

const mockOrders = [
  {
    id: "#ORD-7234",
    date: "Oct 24, 2024",
    status: "Delivered",
    total: "$125.00",
    items: ["Modern Cotton T-Shirt", "Slim Fit Jeans"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80"
  },
  {
    id: "#ORD-7112",
    date: "Oct 10, 2024",
    status: "Processing",
    total: "$85.50",
    items: ["Casual Sneakers"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80"
  },
  {
    id: "#ORD-7009",
    date: "Sep 28, 2024",
    status: "Cancelled",
    total: "$45.00",
    items: ["Baseball Cap"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80"
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
    case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
        <p className="text-gray-500 text-sm mt-1">View and track your recent orders.</p>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-sm transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image Placeholder */}
              <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                <img src={order.image} alt="Order" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.items.join(", ")}</h3>
                    <p className="text-sm text-gray-500 mt-1">Order {order.id} • {order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border w-fit ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <p className="font-medium text-gray-900">{order.total}</p>
                  <Button variant="outline" className="text-sm py-1.5 h-auto">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
