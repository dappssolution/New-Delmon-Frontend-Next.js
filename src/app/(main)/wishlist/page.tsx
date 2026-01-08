"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/common";
import Loading from "@/src/components/common/Loading";
import { Trash2, Loader2 } from "lucide-react";
import {
    fetchWishlist,
    removeFromWishlist,
} from "@/src/redux/wishlist/wishlistThunk";
import { addToCart } from "@/src/redux/cart/cartThunk";
import { clearWishlistError, clearWishlistMessage } from "@/src/redux/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { RootState } from "@/src/redux/store";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

function WishlistContent() {
    const dispatch = useAppDispatch();
    const { wishlist, loading, loadingProductId, error, message } = useAppSelector((state: RootState) => state.wishlist);
    const [addingToCart, setAddingToCart] = useState<number | null>(null);
    const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({});
    const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
    const [selectedColors, setSelectedColors] = useState<Record<number, string>>({});

    useEffect(() => {
        if (wishlist) {
            const quantities: Record<number, number> = {};
            const sizes: Record<number, string> = {};
            const colors: Record<number, string> = {};

            wishlist.forEach(item => {
                quantities[item.product_id] = 1;

                // Set default size if available
                if (item.product.product_size) {
                    const availableSizes = item.product.product_size.split(',').map(s => s.trim());
                    if (availableSizes.length > 0) sizes[item.product_id] = availableSizes[0];
                }

                // Set default color if available
                if (item.product.product_color) {
                    const availableColors = item.product.product_color.split(',').map(c => c.trim());
                    if (availableColors.length > 0) colors[item.product_id] = availableColors[0];
                }
            });

            setLocalQuantities(quantities);
            setSelectedSizes(sizes);
            setSelectedColors(colors);
        }
    }, [wishlist]);

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                dispatch(clearWishlistMessage());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, dispatch]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearWishlistError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const handleRemoveItem = async (productId: number) => {
        if (loadingProductId === productId) return;
        await dispatch(removeFromWishlist(productId));
    };

    const updateQuantity = (productId: number, delta: number) => {
        const currentQty = localQuantities[productId] || 1;
        const newQuantity = Math.max(1, currentQty + delta);

        setLocalQuantities(prev => ({
            ...prev,
            [productId]: newQuantity
        }));
    };

    const handleAddToCart = async (productId: number) => {
        setAddingToCart(productId);
        const qty = localQuantities[productId] || 1;
        const color = selectedColors[productId];
        const size = selectedSizes[productId];

        await dispatch(addToCart({
            productId,
            payload: {
                qty,
                ...(color && { color }),
                ...(size && { size })
            }
        }));
        setAddingToCart(null);
    };

    const wishlistItems = wishlist || [];

    return (
        <div className="min-h-screen bg-gray-50 py-8 text-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <span>Delmon</span>
                    <span className="mx-2">›</span>
                    <span>Home</span>
                    <span className="mx-2">›</span>
                    <span className="text-gray-900 font-medium">Wishlist</span>
                </div>

                {/* Page Title */}
                <h1 className="text-3xl font-bold mb-8">Wishlist</h1>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {loading && !wishlist ? (
                    <Loading className="py-20" />
                ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
                        <Button onClick={() => window.location.href = "/"}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Wishlist Content */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                            {/* Desktop Header - Hidden on Mobile */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700">
                                <div className="col-span-5">Product Details</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-center">Total</div>
                                <div className="col-span-3 text-center">Action</div>
                            </div>

                            {/* Wishlist Items */}
                            <div className="divide-y divide-gray-200">
                                {wishlistItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 md:px-6 md:py-6 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Mobile View */}
                                        <div className="flex flex-col md:hidden gap-4">
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative shrink-0">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.product.product_thambnail}`}
                                                        alt={item.product.product_name}
                                                        width={80}
                                                        height={80}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                        {item.product.product_name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {item.product.product_size && (
                                                            <select
                                                                value={selectedSizes[item.product_id] || ""}
                                                                onChange={(e) => setSelectedSizes(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                                                                className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1 py-0.5"
                                                            >
                                                                {item.product.product_size.split(',').map(size => (
                                                                    <option key={size.trim()} value={size.trim()}>{size.trim()}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                        {item.product.product_color && (
                                                            <select
                                                                value={selectedColors[item.product_id] || ""}
                                                                onChange={(e) => setSelectedColors(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                                                                className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1 py-0.5"
                                                            >
                                                                {item.product.product_color.split(',').map(color => (
                                                                    <option key={color.trim()} value={color.trim()}>{color.trim()}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                    <p className="text-green-700 font-bold mt-2">
                                                        AED {(parseFloat(item.product.selling_price) * (localQuantities[item.product_id] || 1)).toFixed(2)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.product_id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 self-start"
                                                    disabled={loadingProductId === item.product_id}
                                                >
                                                    {loadingProductId === item.product_id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between gap-4 pt-2">
                                                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden h-9 w-24">
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, -1)}
                                                        className="w-8 h-full hover:bg-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-50"
                                                        disabled={localQuantities[item.product_id] <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">
                                                        {localQuantities[item.product_id] || 1}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, 1)}
                                                        className="w-8 h-full hover:bg-gray-100 flex items-center justify-center text-gray-600"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    className="flex-1 h-9 text-sm rounded-full bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleAddToCart(item.product_id)}
                                                    disabled={addingToCart === item.product_id}
                                                >
                                                    {addingToCart === item.product_id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    ) : null}
                                                    Add To Cart
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Desktop View */}
                                        <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                            {/* Product Info */}
                                            <div className="col-span-5 flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative shrink-0">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.product.product_thambnail}`}
                                                        alt={item.product.product_name}
                                                        width={60}
                                                        height={60}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                                                        {item.product.product_name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {item.product.product_size && (
                                                            <select
                                                                value={selectedSizes[item.product_id] || ""}
                                                                onChange={(e) => setSelectedSizes(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                                                                className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1 py-0.5 outline-none focus:border-green-500"
                                                            >
                                                                {item.product.product_size.split(',').map(size => (
                                                                    <option key={size.trim()} value={size.trim()}>{size.trim()}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                        {item.product.product_color && (
                                                            <select
                                                                value={selectedColors[item.product_id] || ""}
                                                                onChange={(e) => setSelectedColors(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                                                                className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1 py-0.5 outline-none focus:border-green-500"
                                                            >
                                                                {item.product.product_color.split(',').map(color => (
                                                                    <option key={color.trim()} value={color.trim()}>{color.trim()}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="col-span-2 text-center">
                                                <div className="flex items-center justify-center border border-gray-300 rounded-full overflow-hidden h-8 w-20 mx-auto">
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, -1)}
                                                        className="w-8 h-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600 disabled:opacity-50"
                                                        disabled={localQuantities[item.product_id] <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-medium">
                                                        {localQuantities[item.product_id] || 1}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, 1)}
                                                        className="w-8 h-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Total Price */}
                                            <div className="col-span-2 text-center font-semibold text-gray-900">
                                                AED {(parseFloat(item.product.selling_price) * (localQuantities[item.product_id] || 1)).toFixed(2)}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="col-span-3 flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleRemoveItem(item.product_id)}
                                                    className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors disabled:opacity-50 text-gray-400"
                                                    aria-label="Remove item"
                                                    disabled={loadingProductId === item.product_id}
                                                >
                                                    {loadingProductId === item.product_id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                                <Button
                                                    variant="primary"
                                                    className="px-6 py-2 text-sm rounded-full bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleAddToCart(item.product_id)}
                                                    disabled={addingToCart === item.product_id}
                                                >
                                                    {addingToCart === item.product_id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    ) : null}
                                                    Add To Cart
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function WishlistPage() {
    return (
        <ProtectedRoute>
            <WishlistContent />
        </ProtectedRoute>
    );
}
