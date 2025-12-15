import React from "react";
import { Heart, Scale, Eye } from "lucide-react";
import Link from "next/link";

export interface Product {
    id: number;
    category: string;
    title: string;
    price: string;
    oldPrice?: string;
    image: string;
    badge?: string;
}

interface ProductCardProps {
    product: Product;
    showBadge?: boolean;
    backgroundColor?: string;
}

export default function ProductCard({
    product,
    showBadge = true,
    backgroundColor = "bg-white"
}: ProductCardProps) {
    return (
        <div className={`${backgroundColor} rounded-lg overflow-hidden group`}>
            <div className="relative bg-gray-100 h-48 md:h-64 flex items-center justify-center p-4 md:p-6">
                {showBadge && product.badge && (
                    <span className="absolute top-3 md:top-4 left-3 md:left-4 bg-green-700 text-white text-xs font-semibold px-2 md:px-3 py-1 rounded">
                        {product.badge}
                    </span>
                )}
                <button className="absolute top-3 md:top-4 right-3 md:right-4 w-8 h-8 md:w-9 md:h-9 bg-white rounded-full flex items-center justify-center shadow-sm border hover:border-green-700 hover:text-white z-10">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-green-700" />
                </button>
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                </Link>
            </div>
            <div className="p-3 md:p-4">
                <p className="text-gray-500 text-xs font-medium mb-1 md:mb-2">
                    {product.category}
                </p>
                <h3 className="text-gray-900 text-sm font-normal mb-2 md:mb-3 line-clamp-2 min-h-[36px] md:min-h-[40px]">
                    {product.title}
                </h3>
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <p className="text-gray-900 text-base md:text-lg font-semibold">
                        {product.price}
                    </p>
                    {product.oldPrice && (
                        <p className="text-gray-400 text-xs md:text-sm line-through">
                            {product.oldPrice}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex-1 bg-[#0d6838] text-white text-xs md:text-sm font-medium py-2 md:py-2.5 rounded hover:bg-green-800">
                        Add To Cart
                    </button>
                    <button className="w-9 h-9 md:w-10 md:h-10 bg-white border border-gray-300 rounded flex items-center justify-center hover:border-green-700 hover:text-green-700">
                        <Scale className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-700" />
                    </button>
                    <button className="w-9 h-9 md:w-10 md:h-10 bg-white border border-gray-300 rounded flex items-center justify-center hover:border-green-700 hover:text-green-700">
                        <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-700" />
                    </button>
                </div>
            </div>
        </div>
    );
}
