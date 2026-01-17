"use client";

import React, { useState } from "react";
import { Heart, Loader2, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/src/redux/cart/cartThunk";
import { AppDispatch, RootState } from "@/src/redux/store";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { addToWishlist, removeFromWishlist } from "@/src/redux/wishlist/wishlistThunk";


export interface Product {
    id: number;
    slug: string;
    category: string;
    title: string;
    price: string;
    oldPrice?: string;
    image: string;
    discount?: string;
    badge?: string;
    colors?: string[];
    sizes?: string[];
}

interface ProductCardProps {
    product: Product;
    showBadge?: boolean;
    backgroundColor?: string;
}

const colorMap: Record<string, string> = {
    "red": "#EF4444",
    "blue": "#3B82F6",
    "green": "#10B981",
    "yellow": "#EAB308",
    "black": "#000000",
    "white": "#FFFFFF",
    "brown": "#78350F",
    "navy": "#1E3A8A",
    "orange": "#F97316",
    "purple": "#A855F7",
    "grey": "#6B7280",
    "gray": "#6B7280",
    "pink": "#EC4899",
    "gold": "#FFD700",
    "silver": "#C0C0C0"
};

export default function ProductCard({
    product,
    showBadge = true,
}: ProductCardProps) {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const { wishlist, loadingProductId } = useAppSelector((state: RootState) => state.wishlist);

    const [isAdding, setIsAdding] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const isInWishlist = wishlist?.some(item => item.product_id === product.id);
    const isWishlistLoading = loadingProductId === product.id;

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            toast.error("Please login to manage your wishlist");
            return;
        }

        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlist(product.id)).unwrap();
                toast.success("Removed from wishlist");
            } else {
                await dispatch(addToWishlist(product.id)).unwrap();
                toast.success("Added to wishlist");
            }
        } catch (error: any) {
            toast.error(error || "Something went wrong");
        }
    };

    const discountBadge = product.discount || product.badge;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const hasColors = product.colors && product.colors.length > 0;
        const hasSizes = product.sizes && product.sizes.length > 0;

        if (hasColors || hasSizes) {
            if (hasColors && product.colors!.length === 1) setSelectedColor(product.colors![0]);
            if (hasSizes && product.sizes!.length === 1) setSelectedSize(product.sizes![0]);
            setShowModal(true);
            return;
        }

        performAddToCart();
    };

    const performAddToCart = async (payload: any = { qty: 1 }) => {
        if (isAdding) return;

        setIsAdding(true);
        try {
            await dispatch(addToCart({
                productId: product.id,
                payload
            })).unwrap();
            toast.success("Added to cart");
            setShowModal(false);
            setSelectedColor(null);
            setSelectedSize(null);
        } catch (error) {
            console.error("Failed to add to cart", error);
            toast.error("Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };

    const handleConfirmVariant = () => {
        const hasColors = product.colors && product.colors.length > 0;
        const hasSizes = product.sizes && product.sizes.length > 0;

        if (hasColors && !selectedColor) {
            toast.error("Please select a color");
            return;
        }
        if (hasSizes && !selectedSize) {
            toast.error("Please select a size");
            return;
        }

        const payload: any = { qty: 1 };
        if (selectedColor) payload.color = selectedColor;
        if (selectedSize) payload.size = selectedSize;

        performAddToCart(payload);
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <div className="w-full h-full flex flex-col group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/8 border border-gray-100 hover:border-gray-200">
                {/* Image Section */}
                <div className="relative w-full pt-[100%] overflow-hidden shrink-0 bg-gray-50">
                    <Link href={`/product/${encodeURIComponent(product.slug)}`} className="absolute inset-0 block">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </Link>

                    {/* Badge */}
                    {showBadge && discountBadge && (
                        <div className="absolute top-2 left-2 md:top-3 md:left-3">
                            <span className="inline-flex items-center bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] md:text-[11px] font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full shadow-sm">
                                {discountBadge.replace(/[^0-9%]/g, '')} OFF
                            </span>
                        </div>
                    )}

                    {/* Quick Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${isInWishlist
                            ? 'bg-[#006637] text-white shadow-lg'
                            : 'bg-white/90 text-gray-600 hover:bg-white hover:text-[#006637] shadow-sm'
                            }`}
                    >
                        {isWishlistLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Heart
                                className="w-4 h-4"
                                fill={isInWishlist ? "currentColor" : "none"}
                            />
                        )}
                    </button>
                </div>

                {/* Content Section */}
                <div className="p-3 md:p-4 flex flex-col grow">
                    {/* Category */}
                    <p className="text-[#006637] text-[10px] md:text-xs font-medium uppercase tracking-wide mb-1">
                        {product.category}
                    </p>

                    {/* Title - Fixed height for consistency */}
                    <Link href={`/product/${encodeURIComponent(product.slug)}`}>
                        <h3 className="text-gray-900 text-[13px] md:text-[15px] font-semibold mb-2 hover:text-[#006637] transition-colors duration-200 line-clamp-2 leading-snug h-[36px] md:h-[42px]">
                            {product.title}
                        </h3>
                    </Link>

                    {/* Price Section */}
                    <div className="flex items-baseline gap-2 mb-3 md:mb-4 mt-auto">
                        <span className="text-gray-900 text-base md:text-lg font-bold">
                            {product.price}
                        </span>
                        {product.oldPrice && (
                            <span className="text-gray-400 text-xs md:text-sm line-through">
                                {product.oldPrice}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className="w-full bg-[#006637] hover:bg-[#005229] text-white text-xs md:text-sm font-semibold py-2.5 md:py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md active:scale-[0.98]"
                    >
                        {isAdding ? (
                            <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                        ) : (
                            <>
                                <ShoppingBag className="w-4 h-4" />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Quick View / Variant Selection Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all animate-modalIn"
                        onClick={stopPropagation}
                    >
                        <div className="relative p-5 md:p-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <h3 className="text-lg font-bold text-gray-900 mb-1 pr-10">Select Options</h3>
                            <p className="text-sm text-gray-500 mb-5 line-clamp-1">{product.title}</p>

                            <div className="flex gap-4 mb-6 p-3 bg-gray-50 rounded-xl">
                                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm">
                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="block text-xl font-bold text-[#006637]">{product.price}</span>
                                    {product.oldPrice && <span className="text-sm text-gray-400 line-through">{product.oldPrice}</span>}
                                </div>
                            </div>

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">Color</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map(color => {
                                            const clrLower = color.toLowerCase();
                                            const bg = colorMap[clrLower] || clrLower;
                                            return (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none ${selectedColor === color ? 'border-[#006637] ring-2 ring-[#006637]/20' : 'border-gray-200'}`}
                                                    title={color}
                                                >
                                                    <span
                                                        className="w-7 h-7 rounded-full border border-gray-100"
                                                        style={{ backgroundColor: bg }}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">Size</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${selectedSize === size
                                                    ? 'border-[#006637] bg-[#006637] text-white'
                                                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleConfirmVariant}
                                disabled={isAdding}
                                className="w-full bg-[#006637] hover:bg-[#005229] text-white font-bold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-[#006637]/20 active:scale-[0.98]"
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        Confirm & Add to Cart
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <style jsx>{`
                        @keyframes modalIn {
                            from {
                                opacity: 0;
                                transform: scale(0.95) translateY(10px);
                            }
                            to {
                                opacity: 1;
                                transform: scale(1) translateY(0);
                            }
                        }
                        .animate-modalIn {
                            animation: modalIn 0.2s ease-out;
                        }
                    `}</style>
                </div>
            )}
        </>
    );
}