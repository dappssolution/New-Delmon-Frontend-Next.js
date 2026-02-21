import React from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { OrderData } from '@/src/types/user.types';

interface RecentOrdersProps {
    orders: OrderData[];
}

const RecentOrders = ({ orders }: RecentOrdersProps) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
                <Link
                    href="/account/orders"
                    className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                    View All
                </Link>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No recent orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{order.invoice_no}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(order.order_date)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{order.currency} {order.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link href={`/account/orders/${order.id}`} className="text-gray-400 hover:text-green-600 transition-colors">
                                            <Eye className="w-5 h-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
