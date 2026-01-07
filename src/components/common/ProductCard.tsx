"use client";

import React, { useState } from "react";
import { Heart, Loader2, X } from "lucide-react";
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
            <div className="w-full flex flex-col group bg-white">
                {/* Image Section */}
                <div className="relative w-full pt-[100%] rounded-2xl overflow-hidden shrink-0 transition-all duration-300 bg-gray-50">
                    <Link href={`/product/${encodeURIComponent(product.slug)}`} className="absolute inset-0 block">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </Link>
                </div>

                {/* Content Section  */}
                <div className="py-4 flex flex-col grow">
                    {/* Category */}
                    <p className="text-gray-500 text-sm mb-1">
                        {product.category}
                    </p>

                    {/* Title */}
                    <Link href={`/product/${encodeURIComponent(product.slug)}`}>
                        <h3 className="text-black text-[17px] font-bold mb-1 hover:text-[#006637] transition-colors line-clamp-1">
                            {product.title}
                        </h3>
                    </Link>

                    {/* Price Section */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-black text-base font-bold">
                            {product.price}
                        </span>
                        {product.oldPrice && (
                            <span className="text-gray-400 text-sm line-through font-medium">
                                {product.oldPrice}
                            </span>
                        )}
                        {showBadge && discountBadge && (
                            <span className="bg-red-50 text-red-500 text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                                -{discountBadge.replace(/[^0-9%]/g, '')}
                            </span>
                        )}
                    </div>

                    {/* Buttons Section */}
                    <div className="flex items-center gap-2 mt-auto">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className="flex-1 bg-[#006637] hover:bg-[#004d2a] text-white text-sm font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group-hover:shadow-md"
                        >
                            {isAdding ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Add to Cart
                                    <span className="text-lg leading-none">+</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleWishlistToggle}
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all border-2 shrink-0 ${isInWishlist
                                ? 'bg-[#006637] border-[#006637] text-white'
                                : 'bg-transparent border-[#006637] text-[#006637] hover:bg-green-50'
                                }`}
                        >
                            {isWishlistLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Heart
                                    className="w-5 h-5"
                                    fill={isInWishlist ? "currentColor" : "none"}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick View / Variant Selection Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl"
                        onClick={stopPropagation}
                    >
                        <div className="relative p-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-lg font-bold text-gray-900 mb-1 pr-8">Select Options</h3>
                            <p className="text-sm text-gray-500 mb-4">{product.title}</p>

                            <div className="flex gap-4 mb-6">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                                    <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <span className="block text-lg font-bold text-green-700">{product.price}</span>
                                    {product.oldPrice && <span className="text-sm text-gray-400 line-through">{product.oldPrice}</span>}
                                </div>
                            </div>

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-900 mb-2">Color</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map(color => {
                                            const clrLower = color.toLowerCase();
                                            const bg = colorMap[clrLower] || clrLower;
                                            return (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 bg-white' : ''}`}
                                                    title={color}
                                                >
                                                    <span
                                                        className="w-full h-full rounded-full border border-gray-100"
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
                                    <p className="text-sm font-medium text-gray-900 mb-2">Size</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-3 py-1.5 text-sm rounded-md border transition-all ${selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
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
                                className="w-full bg-[#006637] hover:bg-[#004d2a] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Confirm & Add to Cart"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}