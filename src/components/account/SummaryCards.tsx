import React from 'react';

interface SummaryCardsProps {
    data: {
        total_orders: number;
        pending_orders: number;
        return_orders: number;
        wishlist_count: number;
    };
}

const SummaryCards = ({ data }: SummaryCardsProps) => {
    const stats = [
        {
            label: "Total Orders",
            value: data.total_orders,
            emoji: "📦",
            color: "text-blue-600",
            bg: "bg-blue-50/50"
        },
        {
            label: "Pending",
            value: data.pending_orders,
            emoji: "🚚",
            color: "text-amber-600",
            bg: "bg-amber-50/50"
        },
        {
            label: "Returns",
            value: data.return_orders,
            emoji: "🔄",
            color: "text-orange-600",
            bg: "bg-orange-50/50"
        },
        {
            label: "Wishlist",
            value: data.wishlist_count,
            emoji: "❤️",
            color: "text-rose-600",
            bg: "bg-rose-50/50"
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 mt-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="p-6 bg-white border-2 border-green-600 rounded-2xl transition-all duration-300"
                >
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {stat.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-gray-900 tracking-tight">
                            {stat.value}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
