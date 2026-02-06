"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Heart, ChevronDown, ChevronUp, Loader2, Minus, Plus, ChevronRight, ShoppingCart, Package, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Loading from "../../../../components/common/Loading";
import { homeApi } from "../../../../service/homeApi";
import ProductCard, { Product as ProductCardType } from "../../../../components/common/ProductCard";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { addToCart } from "@/src/redux/cart/cartThunk";
import { clearCartError, clearCartMessage } from "@/src/redux/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/src/redux/wishlist/wishlistThunk";
import { clearWishlistError, clearWishlistMessage } from "@/src/redux/wishlist/wishlistSlice";
import { ProductData, RelatedProduct } from "@/src/types/product.types";

interface ProductImage {
    id: number;
    product_id: number;
    photo_name: string;
    created_at: string;
    updated_at: string | null;
}

interface WholesalePrice {
    id: number;
    product_id: number;
    min_qty: number;
    max_qty: number;
    price_per_peice: number;
    created_at: string;
    updated_at: string | null;
}


const ProductAccordion = ({ title, content, isOpen, onClick }: { title: string, content: string | React.ReactNode, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className="border-b border-gray-100">
            <button
                className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
                onClick={onClick}
            >
                <span className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-[#006637] transition-colors">{title}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#006637] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                <div className="text-gray-600 leading-relaxed text-sm">
                    {typeof content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} className="prose prose-sm max-w-none" />
                    ) : (
                        content
                    )}
                </div>
            </div>
        </div>
    );
};

export default function ProductDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const dispatch = useAppDispatch();
    const { loading: cartLoading, error: cartError, message: cartMessage } = useAppSelector((state) => state.cart);
    const { token } = useAppSelector((state) => state.auth);
    const { wishlist, loadingProductId, error: wishlistError, message: wishlistMessage } = useAppSelector((state) => state.wishlist);

    const [product, setProduct] = useState<ProductData | null>(null);
    const [productImages, setProductImages] = useState<ProductImage[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<ProductCardType[]>([]);
    const [wholesalePrices, setWholesalePrices] = useState<WholesalePrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");
    const [openAccordion, setOpenAccordion] = useState<string | null>("description");
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    const isInWishlist = wishlist?.some(item => item.product_id === product?.id);
    const isWishlistLoading = loadingProductId === product?.id;

    const handleWishlistToggle = async () => {
        if (!token) {
            toast.error("Please login to manage your wishlist");
            return;
        }

        if (!product) return;

        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlist(product.id)).unwrap();
            } else {
                await dispatch(addToWishlist(product.id)).unwrap();
            }
        } catch (error: any) {
            console.error("Wishlist operation failed", error);
        }
    };

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
        "gray": "#6B7280"
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!slug) return;

            setLoading(true);
            console.log("Fetching product with slug:", slug);
            try {
                const response = await homeApi.getProductBySlug(slug);

                if (response.success && response.data) {
                    setProduct(response.data.product);
                    setActiveImage(response.data.product.product_thambnail);

                    if (response.data.images && response.data.images.length > 0) {
                        setProductImages(response.data.images);
                    }

                    if (response.data.product.wholesale_prices && response.data.product.wholesale_prices.length > 0) {
                        setWholesalePrices(response.data.product.wholesale_prices);
                    }

                    if (response.data.product.product_color) {
                        const colors = response.data.product.product_color.split(',').map((c: string) => c.trim());
                        if (colors.length > 0) setSelectedColor(colors[0]);
                    }

                    if (response.data.product.product_size) {
                        const sizes = response.data.product.product_size.split(',').map((s: string) => s.trim());
                        if (sizes.length > 0) setSelectedSize(sizes[0]);
                    }

                    if (response.data.related && response.data.related.length > 0) {
                        const mappedRelated: ProductCardType[] = response.data.related.map((item: RelatedProduct) => {
                            let finalPrice = item.selling_price;
                            let oldPrice = undefined;
                            let badge = undefined;

                            if (item.discount_price) {
                                finalPrice = item.discount_price;
                                oldPrice = item.selling_price;
                                const sell = parseFloat(item.selling_price);
                                const disc = parseFloat(item.discount_price);
                                if (sell > 0) {
                                    const percent = Math.round(((sell - disc) / sell) * 100);
                                    badge = `${percent}% Off`;
                                }
                            }

                            const colors = item.product_color ? item.product_color.split(',').map(c => c.trim()).filter(Boolean) : [];
                            const sizes = item.product_size ? item.product_size.split(',').map(s => s.trim()).filter(Boolean) : [];

                            return {
                                id: item.id,
                                slug: item.product_slug,
                                category: item.category_name || item.brand?.brand_name || "Uncategorized",
                                title: item.product_name,
                                price: `AED${finalPrice}`,
                                oldPrice: oldPrice ? `AED${oldPrice}` : undefined,
                                image: `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${item.product_thambnail}`,
                                badge: badge,
                                colors: colors.length > 0 ? colors : undefined,
                                sizes: sizes.length > 0 ? sizes : undefined
                            };
                        });
                        setRelatedProducts(mappedRelated);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch product details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
        setQuantity(1);
    }, [slug]);

    useEffect(() => {
        if (cartMessage) {
            toast.success(cartMessage);
            const timer = setTimeout(() => {
                dispatch(clearCartMessage());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [cartMessage, dispatch]);

    useEffect(() => {
        if (cartError) {
            toast.error(cartError);
            const timer = setTimeout(() => {
                dispatch(clearCartError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [cartError, dispatch]);

    useEffect(() => {
        if (wishlistMessage) {
            toast.success(wishlistMessage);
            const timer = setTimeout(() => {
                dispatch(clearWishlistMessage());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [wishlistMessage, dispatch]);

    useEffect(() => {
        if (wishlistError) {
            toast.error(wishlistError);
            const timer = setTimeout(() => {
                dispatch(clearWishlistError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [wishlistError, dispatch]);

    const handleAddToCart = async () => {
        if (!product) return;

        const payload: any = {
            qty: quantity,
        };

        if (selectedColor) {
            payload.color = selectedColor;
        }

        if (selectedSize) {
            payload.size = selectedSize;
        }

        await dispatch(addToCart({
            productId: product.id,
            payload: payload
        }));
    };

    if (loading) {
        return <Loading />;
    }

    if (!product) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-white">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
                <Link href="/products" className="text-[#006637] hover:underline font-medium">
                    Back to all products
                </Link>
            </div>
        );
    }

    const getWholesalePrice = (qty: number): number | null => {
        if (!wholesalePrices || wholesalePrices.length === 0) return null;

        const applicablePrice = wholesalePrices.find(
            (wp) => qty >= wp.min_qty && qty <= wp.max_qty
        );

        return applicablePrice ? applicablePrice.price_per_peice : null;
    };

    const hasDiscount = product.discount_price !== null;
    const wholesalePrice = getWholesalePrice(quantity);
    const currentPrice = wholesalePrice
        ? wholesalePrice.toString()
        : (hasDiscount ? product.discount_price : product.selling_price);
    const discountPercent = hasDiscount
        ? Math.round(((parseFloat(product.selling_price) - parseFloat(product.discount_price!)) / parseFloat(product.selling_price)) * 100)
        : 0;

    const allImages = [
        { id: 0, photo_name: product.product_thambnail },
        ...productImages
    ];

    const colors = product.product_color ? product.product_color.split(',').map(c => c.trim()) : [];
    const sizes = product.product_size ? product.product_size.split(',').map(s => s.trim()) : [];

    const toggleAccordion = (section: string) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-3 pb-3 sm:pt-4 sm:pb-4">
                    <nav className="flex items-center text-xs sm:text-sm text-gray-500 flex-wrap gap-1">
                        <Link href="/" className="hover:text-[#006637] transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0" />
                        {product.category && (
                            <>
                                <Link href="/products" className="hover:text-[#006637] transition-colors">{product.category.category_name}</Link>
                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0" />
                            </>
                        )}
                        <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-none">{product.product_name}</span>
                    </nav>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10">

                    {/* Left Column - Image Gallery (4 columns on lg) */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-24 max-w-sm mx-auto lg:max-w-none">
                            {/* Main Image */}
                            <div
                                ref={imageRef}
                                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden mb-3 sm:mb-4 p-3 sm:p-4 md:p-5 flex items-center justify-center aspect-square relative cursor-zoom-in shadow-sm border border-gray-100"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${activeImage}`}
                                    alt={product.product_name}
                                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300"
                                    style={{
                                        transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
                                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                    }}
                                />
                                {hasDiscount && (
                                    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Thumbnails - Center aligned */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={img.id || index}
                                            className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 bg-white rounded-lg sm:rounded-xl flex items-center justify-center p-1.5 sm:p-2 border-2 transition-all shadow-sm ${activeImage === img.photo_name
                                                ? 'border-[#006637] ring-2 ring-[#006637]/20'
                                                : 'border-gray-100 hover:border-gray-300'
                                                }`}
                                            onClick={() => setActiveImage(img.photo_name)}
                                        >
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${img.photo_name}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Product Details (8 columns on lg) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 lg:sticky lg:top-24">
                            {/* Category */}
                            <div className="mb-3 sm:mb-4">
                                <span className="inline-block bg-[#006637]/10 text-[#006637] text-xs font-semibold px-3 py-1.5 rounded-full">
                                    {product.category?.category_name || "Products"}
                                </span>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight">
                                {product.product_name}
                            </h1>

                            {/* Price Section */}
                            <div className="mb-5 sm:mb-6">
                                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-3">
                                    <span className="text-2xl sm:text-3xl font-bold text-[#006637]">AED {currentPrice}</span>
                                    {wholesalePrice && (
                                        <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                            Wholesale Price
                                        </span>
                                    )}
                                    {!wholesalePrice && hasDiscount && (
                                        <>
                                            <span className="text-base sm:text-lg text-gray-400 line-through">AED {product.selling_price}</span>
                                            <span className="text-xs sm:text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                                Save {discountPercent}%
                                            </span>
                                        </>
                                    )}
                                    {!wholesalePrice && !hasDiscount && (
                                        <span className="text-sm text-gray-500">Regular Price</span>
                                    )}
                                </div>

                                {/* Wholesale Price Tiers */}
                                {wholesalePrices.length > 0 && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Wholesale Pricing</h4>
                                        <div className="space-y-1.5">
                                            {wholesalePrices.map((wp) => (
                                                <div
                                                    key={wp.id}
                                                    className={`flex items-center justify-between text-xs sm:text-sm p-2 rounded-lg transition-colors ${quantity >= wp.min_qty && quantity <= wp.max_qty
                                                            ? 'bg-blue-200 text-blue-900 font-semibold'
                                                            : 'text-blue-700'
                                                        }`}
                                                >
                                                    <span>
                                                        {wp.min_qty} - {wp.max_qty} pieces
                                                    </span>
                                                    <span className="font-semibold">
                                                        AED {wp.price_per_peice} each
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-100 w-full mb-5 sm:mb-6"></div>

                            {/* Color Selection */}
                            {colors.length > 0 && (
                                <div className="mb-5 sm:mb-6">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                                        <span className="text-sm sm:text-base text-gray-700 font-medium">Color:</span>
                                        <span className="text-sm text-gray-500 capitalize">{selectedColor}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                        {colors.map((color) => {
                                            const clrLower = color.toLowerCase();
                                            const bg = colorMap[clrLower] || clrLower;
                                            return (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 focus:outline-none ${selectedColor === color
                                                        ? 'border-[#006637] ring-4 ring-[#006637]/20'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    style={{ backgroundColor: bg }}
                                                    title={color}
                                                >
                                                    {selectedColor === color && (
                                                        <svg className="w-4 h-4" fill="none" stroke={bg === '#FFFFFF' ? '#000' : '#fff'} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {sizes.length > 0 && (
                                <div className="mb-5 sm:mb-6">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                                        <span className="text-sm sm:text-base text-gray-700 font-medium">Size:</span>
                                        <span className="text-sm text-gray-500">{selectedSize}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[40px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 transition-all focus:outline-none text-sm font-medium ${selectedSize === size
                                                    ? 'border-[#006637] bg-[#006637] text-white'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="h-px bg-gray-100 w-full mb-5 sm:mb-6"></div>

                            {/* Quantity & Actions */}
                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                {/* Mobile: Quantity + Wishlist in same row */}
                                <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <span className="text-sm sm:text-base text-gray-700 font-medium">Qty:</span>
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 sm:w-14 text-center font-semibold text-gray-900">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(q => q + 1)}
                                                className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Wishlist - visible on mobile in this row */}
                                    <button
                                        onClick={handleWishlistToggle}
                                        disabled={isWishlistLoading}
                                        className={`w-11 h-11 sm:hidden rounded-xl flex items-center justify-center transition-all border-2 flex-shrink-0 ${isInWishlist
                                            ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                                            : 'bg-white text-gray-500 border-gray-200 hover:text-red-500 hover:border-red-200'
                                            }`}
                                    >
                                        {isWishlistLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                                        )}
                                    </button>
                                </div>

                                {/* Add to Cart Button - Full width on mobile */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={cartLoading}
                                        className="flex-1 bg-[#006637] hover:bg-[#005530] text-white font-semibold h-11 sm:h-14 px-6 sm:px-8 rounded-xl transition-all shadow-lg shadow-[#006637]/30 hover:shadow-xl hover:shadow-[#006637]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        {cartLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5" />
                                                <span>Add to Cart</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Wishlist - visible only on desktop */}
                                    <button
                                        onClick={handleWishlistToggle}
                                        disabled={isWishlistLoading}
                                        className={`hidden sm:flex w-14 h-14 rounded-xl items-center justify-center transition-all border-2 flex-shrink-0 ${isInWishlist
                                            ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                                            : 'bg-white text-gray-500 border-gray-200 hover:text-red-500 hover:border-red-200'
                                            }`}
                                    >
                                        {isWishlistLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
                                <div className="flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-gray-50">
                                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#006637] mb-1" />
                                    <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Secure Package</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-gray-50">
                                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#006637] mb-1" />
                                    <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-gray-50">
                                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#006637] mb-1" />
                                    <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Quality Assured</span>
                                </div>
                            </div>

                            {/* Details Accordion */}
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Product Details</h3>

                                <ProductAccordion
                                    title="Description"
                                    content={product.long_description || "No description available."}
                                    isOpen={openAccordion === "description"}
                                    onClick={() => toggleAccordion("description")}
                                />
                                <ProductAccordion
                                    title="Specification"
                                    content={product.specification || "No specifications available."}
                                    isOpen={openAccordion === "specification"}
                                    onClick={() => toggleAccordion("specification")}
                                />
                                <ProductAccordion
                                    title="Reviews"
                                    content={<div className="text-gray-500 italic">No reviews yet. Be the first to review this product!</div>}
                                    isOpen={openAccordion === "review"}
                                    onClick={() => toggleAccordion("review")}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 sm:mt-16 lg:mt-20">
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">You May Also Like</h2>
                            <Link href="/products" className="text-[#006637] hover:underline text-sm sm:text-base font-medium flex items-center gap-1">
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                            {relatedProducts.slice(0, 4).map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}