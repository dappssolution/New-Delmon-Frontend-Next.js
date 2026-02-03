"use client";

import React, { useState, useRef } from "react";
import { Heart, Loader2, X, ShoppingCart } from "lucide-react";
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
    const [isAnimating, setIsAnimating] = useState(false);
    const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const wishlistButtonRef = useRef<HTMLButtonElement>(null);

    const isInWishlist = wishlist?.some(item => item.product_id === product.id);
    const isWishlistLoading = loadingProductId === product.id;

    // Fly to Cart Animation
    const flyToCart = () => {
        const button = buttonRef.current;
        if (!button) return;

        // Check if mobile (lg breakpoint is 1024px)
        const isMobile = window.innerWidth < 1024;

        // Get cart icon element - prioritize based on viewport
        let cartIcon;
        if (isMobile) {
            cartIcon = document.getElementById('header-cart-icon-mobile') || document.getElementById('header-cart-icon');
        } else {
            cartIcon = document.getElementById('header-cart-icon') || document.getElementById('header-cart-icon-mobile');
        }
        if (!cartIcon) return;

        const buttonRect = button.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        // Create flying element - larger size for better visibility
        const flyingEl = document.createElement('div');
        flyingEl.innerHTML = `
            <div style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #006637 0%, #00833d 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 30px rgba(0, 102, 55, 0.4);
            ">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="m1 1 4 4 14 .5-.5 6H7L5 5"></path>
                </svg>
            </div>
        `;

        flyingEl.style.cssText = `
            position: fixed;
            z-index: 9999;
            pointer-events: none;
            left: ${buttonRect.left + buttonRect.width / 2 - 30}px;
            top: ${buttonRect.top + buttonRect.height / 2 - 30}px;
            transform: scale(1);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;

        document.body.appendChild(flyingEl);
        setIsAnimating(true);

        // Trigger animation
        requestAnimationFrame(() => {
            flyingEl.style.left = `${cartRect.left + cartRect.width / 2 - 18}px`;
            flyingEl.style.top = `${cartRect.top + cartRect.height / 2 - 18}px`;
            flyingEl.style.transform = 'scale(0.3)';
            flyingEl.style.opacity = '0.8';
        });

        // Add bounce effect to cart icon
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1.3)';
            cartIcon.style.transition = 'transform 0.2s ease';
        }, 700);

        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 900);

        // Cleanup
        setTimeout(() => {
            flyingEl.remove();
            setIsAnimating(false);
        }, 800);
    };

    // Fly to Wishlist Animation (Desktop only)
    const flyToWishlist = () => {
        const button = wishlistButtonRef.current;
        if (!button) return;

        // Check if desktop (lg breakpoint is 1024px)
        const isDesktop = window.innerWidth >= 1024;

        if (isDesktop) {
            // Desktop: Fly to header wishlist icon
            const wishlistIcon = document.getElementById('header-wishlist-icon');
            if (!wishlistIcon) return;

            const buttonRect = button.getBoundingClientRect();
            const wishlistRect = wishlistIcon.getBoundingClientRect();

            // Create flying heart element
            const flyingEl = document.createElement('div');
            flyingEl.innerHTML = `
                <div style="
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #006637 0%, #00833d 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px rgba(0, 102, 55, 0.4);
                ">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
            `;

            flyingEl.style.cssText = `
                position: fixed;
                z-index: 9999;
                pointer-events: none;
                left: ${buttonRect.left + buttonRect.width / 2 - 22}px;
                top: ${buttonRect.top + buttonRect.height / 2 - 22}px;
                transform: scale(1);
                transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            `;

            document.body.appendChild(flyingEl);
            setIsWishlistAnimating(true);

            // Trigger fly animation
            requestAnimationFrame(() => {
                flyingEl.style.left = `${wishlistRect.left + wishlistRect.width / 2 - 12}px`;
                flyingEl.style.top = `${wishlistRect.top + wishlistRect.height / 2 - 12}px`;
                flyingEl.style.transform = 'scale(0.3)';
                flyingEl.style.opacity = '0.8';
            });

            // Add bounce effect to wishlist header icon
            setTimeout(() => {
                wishlistIcon.style.transform = 'scale(1.3)';
                wishlistIcon.style.transition = 'transform 0.2s ease';
            }, 700);

            setTimeout(() => {
                wishlistIcon.style.transform = 'scale(1)';
            }, 900);

            // Cleanup
            setTimeout(() => {
                flyingEl.remove();
                setIsWishlistAnimating(false);
            }, 800);
        } else {
            // Mobile: 3D vibrate/pulse animation on the button
            setIsWishlistAnimating(true);
            button.style.animation = 'wishlistPulse 0.6s ease-out';

            setTimeout(() => {
                button.style.animation = '';
                setIsWishlistAnimating(false);
            }, 600);
        }
    };

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            toast.error("Please login to manage your wishlist");
            return;
        }

        // Only animate when adding to wishlist
        const willAddToWishlist = !isInWishlist;

        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlist(product.id)).unwrap();
                toast.success("Removed from wishlist");
            } else {
                // Trigger animation when adding
                flyToWishlist();
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

        // Trigger fly animation
        flyToCart();

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
            <div className="bg-white rounded-2xl overflow-hidden shadow-none hover:shadow-lg transition-shadow duration-300 p-2 md:p-4 group border border-gray-200">
                {/* Image Section */}
                <Link href={`/product/${encodeURIComponent(product.slug)}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-xl">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Discount Badge - Bottom Left */}
                        {showBadge && discountBadge && (
                            <div className="absolute bottom-[6px] left-[6px] md:bottom-3 md:left-3">
                                <span className="bg-[#006637] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                                    {discountBadge}
                                </span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Content Section */}
                <div className="pt-3 md:pt-4">
                    {/* Title */}
                    <Link href={`/product/${encodeURIComponent(product.slug)}`}>
                        <h3 className="text-gray-900 text-sm md:text-base font-semibold line-clamp-1 group-hover:text-[#006637] transition-colors mb-1">
                            {product.title}
                        </h3>
                    </Link>

                    {/* Category */}
                    <p className="text-gray-500 text-xs md:text-sm line-clamp-1 mb-2">
                        {product.category}
                    </p>

                    {/* Price Row */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-900 text-sm md:text-base font-bold flex items-center gap-0.5">
                            <img src="/price-icon.png" alt="AED" className="w-4 h-4 md:w-5 md:h-5 object-contain mr-1" />
                            {product.price.replace('AED', '')}
                        </span>
                        {product.oldPrice && (
                            <span className="text-gray-400 text-xs md:text-sm line-through flex items-center gap-0.5">
                                <img src="/price-icon.png" alt="AED" className="w-3 h-3 md:w-4 md:h-4 object-contain opacity-50 mr-1" />
                                {product.oldPrice.replace('AED', '')}
                            </span>
                        )}
                    </div>

                    {/* Buttons Section */}
                    <div className="flex items-center gap-2">
                        <button
                            ref={buttonRef}
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className="flex-1 bg-[#006637] hover:bg-[#004d2a] text-white text-xs md:text-sm font-bold py-2.5 md:py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isAdding ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <ShoppingCart className="w-4 h-4" />
                                    <span className="hidden md:inline">Add to Cart</span>
                                    <span className="md:hidden">Cart</span>
                                </>
                            )}
                        </button>

                        <button
                            ref={wishlistButtonRef}
                            onClick={handleWishlistToggle}
                            className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all border-2 shrink-0 cursor-pointer ${isInWishlist
                                ? 'bg-white border-[#006637] text-[#006637]'
                                : 'bg-transparent border-[#006637] text-[#006637] hover:bg-green-50'
                                }`}
                            style={{
                                animationName: isWishlistAnimating ? 'wishlistPulse' : 'none',
                                animationDuration: '0.6s',
                                animationTimingFunction: 'ease-out'
                            }}
                        >
                            {isWishlistLoading ? (
                                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                            ) : (
                                <Heart
                                    className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 wishlist-heart-icon ${isInWishlist ? 'scale-110' : ''}`}
                                    fill={isInWishlist ? "#006637" : "none"}
                                    stroke={isInWishlist ? "#006637" : "currentColor"}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick View / Variant Selection Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
                    onClick={() => setShowModal(false)}
                >
                    {/* Modal Content - Bottom Sheet on Mobile, Centered on Desktop */}
                    <div
                        className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-3xl overflow-hidden shadow-2xl transform transition-all duration-300 ease-out animate-slideUp md:animate-scaleIn"
                        onClick={stopPropagation}
                    >
                        {/* Drag Handle for Mobile */}
                        <div className="flex justify-center pt-3 pb-2 md:hidden">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                        </div>

                        <div className="relative p-5 md:p-6">
                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X size={18} className="text-gray-600" />
                            </button>

                            {/* Header */}
                            <div className="mb-5">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Select Options</h3>
                                <p className="text-sm text-gray-500 line-clamp-1 pr-10">{product.title}</p>
                            </div>

                            {/* Product Info Card */}
                            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm">
                                    <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="flex items-center gap-1 text-2xl font-bold text-[#006637]">
                                        <img src="/price-icon.png" alt="AED" className="w-6 h-6 object-contain mr-1" />
                                        {product.price.replace('AED', '')}
                                    </span>
                                    {product.oldPrice && (
                                        <span className="text-sm text-gray-400 line-through flex items-center gap-0.5">
                                            <img src="/price-icon.png" alt="AED" className="w-4 h-4 object-contain opacity-50 mr-1" />
                                            {product.oldPrice.replace('AED', '')}
                                        </span>
                                    )}
                                    {discountBadge && (
                                        <span className="inline-block mt-1 bg-[#006637] text-white text-xs font-bold px-2 py-0.5 rounded">
                                            {discountBadge}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">Select Color</p>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map(color => {
                                            const clrLower = color.toLowerCase();
                                            const bg = colorMap[clrLower] || clrLower;
                                            return (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${selectedColor === color
                                                        ? 'border-[#006637] ring-2 ring-offset-2 ring-[#006637]'
                                                        : 'border-gray-200'
                                                        }`}
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
                                    <p className="text-sm font-semibold text-gray-900 mb-3">Select Size</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all cursor-pointer ${selectedSize === size
                                                    ? 'border-[#006637] bg-[#006637] text-white'
                                                    : 'border-gray-200 text-gray-700 hover:border-[#006637] hover:text-[#006637]'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Confirm Button */}
                            <button
                                onClick={handleConfirmVariant}
                                disabled={isAdding}
                                className="w-full bg-[#006637] hover:bg-[#004d2a] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-700/20"
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Confirm & Add to Cart</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}