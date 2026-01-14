"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/src/components/common";
import { Trash2, Loader2 } from "lucide-react";
import {
    fetchCart,
    updateCartItem,
    removeFromCart,
    applyCoupon,
} from "@/src/redux/cart/cartThunk";
import { clearCartError, clearCartMessage } from "@/src/redux/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { RootState } from "@/src/redux/store";
import Loading from "@/src/components/common/Loading";

// Debounce hook
function useDebounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFunction = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    ) as T;

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedFunction;
}

export default function ShoppingCart() {
    const dispatch = useAppDispatch();
    const { cart, loading, error, message } = useAppSelector((state: RootState) => state.cart);
    const [discountCode, setDiscountCode] = useState("");
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const [localQuantities, setLocalQuantities] = useState<Record<number, number>>({});
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

    console.log("cart products:", cart);

    useEffect(() => {
        if (cart?.cart_items) {
            const quantities: Record<number, number> = {};
            cart.cart_items.forEach(item => {
                quantities[item.id] = item.qty;
            });
            setLocalQuantities(quantities);
        }
    }, [cart?.cart_items]);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                dispatch(clearCartMessage());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, dispatch]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearCartError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    // Debounced API call
    const debouncedUpdateCart = useDebounce(async (itemId: number, quantity: number) => {
        setUpdatingItems(prev => new Set(prev).add(itemId));
        await dispatch(updateCartItem({ itemId, quantity }));
        setUpdatingItems(prev => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
        });
    }, 500);

    const updateQuantity = (id: number, delta: number) => {
        const currentQty = localQuantities[id] || 1;
        const newQuantity = Math.max(1, currentQty + delta);

        setLocalQuantities(prev => ({
            ...prev,
            [id]: newQuantity
        }));

        debouncedUpdateCart(id, newQuantity);
    };

    const handleRemoveItem = async (id: number) => {
        await dispatch(removeFromCart(id));
    };

    const handleApplyCoupon = async () => {
        if (!discountCode.trim()) return;

        setApplyingCoupon(true);
        await dispatch(applyCoupon(discountCode));
        setApplyingCoupon(false);
    };

    const cartItems = cart?.cart_items || [];
    const subtotal = cart?.cart_total || 0;
    const shippingCost = cart?.shipping_config?.cost || cart?.shipping_config?.custom_cost || 0;
    const discount = cart?.discount_amount || 0;
    const deliveryFee = shippingCost;
    const total = subtotal + shippingCost;

    return (
        <div className="min-h-screen bg-gray-50 py-8 text-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <span>Delmon</span>
                    <span className="mx-2">›</span>
                    <span>Home</span>
                    <span className="mx-2">›</span>
                    <span className="text-gray-900 font-medium">Cart</span>
                </div>

                {/* Page Title */}
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {loading && !cart ? (
                    <Loading className="py-20" />
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
                        <Button onClick={() => window.location.href = "/"}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg border-2 border-blue-500 p-4 sm:p-6">
                                {/* Table Header - Desktop Only */}
                                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 font-semibold text-gray-700">
                                    <div className="col-span-4">Product Name</div>
                                    <div className="col-span-2 text-center">Size</div>
                                    <div className="col-span-2 text-center">Color</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-1 text-center">Total</div>
                                    <div className="col-span-1 text-center">Action</div>
                                </div>

                                {/* Cart Items */}
                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="py-6">
                                            {/* Mobile View */}
                                            <div className="flex gap-4 md:hidden">
                                                {/* Image */}
                                                <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative shrink-0">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.img}`}
                                                        alt={item.name}
                                                        width={60}
                                                        height={60}
                                                        className="object-contain"
                                                        unoptimized={true}
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {item.size || "-"} | {item.color || "-"}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="p-1.5 -mr-2 text-gray-400 hover:text-red-500 transition-colors"
                                                            disabled={loading}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="flex justify-between items-end mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center border border-gray-300 rounded-md h-8 bg-white">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, -1)}
                                                                    className="w-8 h-full hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-50"
                                                                    disabled={localQuantities[item.id] <= 1}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center text-sm font-medium">
                                                                    {localQuantities[item.id] ?? item.qty}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, 1)}
                                                                    className="w-8 h-full hover:bg-gray-50 flex items-center justify-center text-gray-600"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            {updatingItems.has(item.id) && (
                                                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                                            )}
                                                        </div>
                                                        <div className="font-bold text-gray-900">
                                                            {item.total.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desktop View */}
                                            <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                                                {/* Product Info */}
                                                <div className="col-span-4 flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden relative shrink-0">
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.img}`}
                                                            alt={item.name}
                                                            width={50}
                                                            height={50}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                                                            {item.name}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {/* Size */}
                                                <div className="col-span-2 text-center font-medium text-gray-900 text-sm">
                                                    {item.size || "-"}
                                                </div>

                                                {/* Color */}
                                                <div className="col-span-2 text-center font-medium text-gray-900 text-sm">
                                                    {item.color || "-"}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="col-span-2 flex justify-center">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden h-8">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                                className="w-8 h-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600"
                                                                disabled={localQuantities[item.id] <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-10 text-center text-sm font-medium">
                                                                {localQuantities[item.id] ?? item.qty}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="w-8 h-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-600"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        {updatingItems.has(item.id) && (
                                                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Total Price */}
                                                <div className="col-span-1 text-center font-semibold text-gray-900 text-sm">
                                                    {item.total.toFixed(2)}
                                                </div>

                                                {/* Delete Button */}
                                                <div className="col-span-1 flex justify-center">
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors disabled:opacity-50 text-gray-400"
                                                        aria-label="Remove item"
                                                        disabled={loading}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-100 rounded-lg p-6 sticky top-8">
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Sub Total</span>
                                        <span className="font-semibold">AED {subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-gray-700">
                                            <span>Discount</span>
                                            <span className="font-semibold text-green-600">-AED {discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-700">
                                        <span>Delivery fee</span>
                                        <span className="font-semibold">
                                            {deliveryFee === 0 ? "FREE" : `AED ${deliveryFee.toFixed(2)}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="border-t border-gray-300 pt-4 mb-4">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>AED {total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <p className="text-xs text-gray-600 text-center mb-6">
                                    Delivery Within Days As Far As Possible
                                </p>

                                {/* Checkout Button */}
                                <Button
                                    fullWidth
                                    className="py-3 rounded-full text-lg"
                                    onClick={() => window.location.href = "/checkout"}
                                >
                                    Check Out
                                </Button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}