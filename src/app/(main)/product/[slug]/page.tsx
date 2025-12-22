"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Heart, ArrowRightLeft, Star, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { homeApi } from "../../../../service/homeApi";
import ProductCard, { Product as ProductCardType } from "../../../../components/common/ProductCard";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { addToCart } from "@/src/redux/cart/cartThunk";
import { clearCartError, clearCartMessage } from "@/src/redux/cart/cartSlice";

interface ProductImage {
    id: number;
    product_id: number;
    photo_name: string;
    created_at: string;
    updated_at: string | null;
}

interface Brand {
    id: number;
    brand_name: string;
    brand_slug: string;
    brand_image: string;
    created_at: string;
    updated_at: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
}

interface Category {
    id: number;
    main_category_id: number;
    category_name: string;
    category_slug: string;
    category_image: string;
    created_at: string;
    updated_at: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
}

interface ProductData {
    id: number;
    brand_id: number;
    brand_name: string | null;
    main_category_id: number;
    main_category_name: string | null;
    category_id: number;
    category_name: string | null;
    subcategory_id: number;
    subcategory_name: string | null;
    product_name: string;
    product_slug: string;
    product_code: string;
    product_qty: string;
    product_tags: string;
    product_size: string;
    product_color: string;
    packing: string;
    height: string | null;
    width: string | null;
    length: string | null;
    weight: string | null;
    origin: string;
    alt: string;
    selling_price: string;
    contract_price: string | null;
    discount_price: string | null;
    specification: string;
    short_description: string;
    long_description: string;
    product_thambnail: string;
    vendor_id: number | null;
    hot_deals: number | null;
    featured: number | null;
    special_offer: number | null;
    special_deals: number | null;
    new_product: number;
    category_skip_0: number | null;
    category_skip_4: number | null;
    category_skip_7: number | null;
    meta_title: string | null;
    meta_keyword: string;
    meta_description: string | null;
    wholesale: number;
    status: number;
    created_at: string;
    updated_at: string;
    brand: Brand;
    category: Category;
}

interface RelatedProduct {
    id: number;
    brand_id: number;
    brand_name?: string;
    main_category_id: number;
    main_category_name: string | null;
    category_id: number;
    category_name?: string;
    subcategory_id: number;
    subcategory_name?: string;
    product_name: string;
    product_slug: string;
    product_code: string;
    product_qty: string;
    product_tags?: string;
    product_size?: string;
    product_color?: string;
    packing: string;
    height?: string;
    width?: string;
    length?: string;
    weight?: string;
    origin: string;
    alt: string;
    selling_price: string;
    contract_price: string | null;
    discount_price: string | null;
    specification: string;
    short_description?: string;
    long_description: string;
    product_thambnail: string;
    vendor_id: number | null;
    hot_deals: number | null;
    featured: number | null;
    special_offer?: number;
    special_deals: number | null;
    new_product?: number;
    category_skip_0: number | null;
    category_skip_4: number | null;
    category_skip_7: number | null;
    meta_title?: string;
    meta_keyword: string;
    meta_description?: string;
    wholesale: number;
    status: number;
    created_at: string;
    updated_at: string;
    brand: Brand;
}

const ProductAccordion = ({ title, content, isOpen, onClick }: { title: string, content: string | React.ReactNode, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
                onClick={onClick}
            >
                <span className="text-base font-medium text-gray-900">{title}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="pb-4 text-gray-600 leading-relaxed text-sm">
                    {typeof content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        content
                    )}
                </div>
            )}
        </div>
    );
};

export default function ProductDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const dispatch = useAppDispatch();
    const { loading: cartLoading, error: cartError, message: cartMessage } = useAppSelector((state) => state.cart);

    const [product, setProduct] = useState<ProductData | null>(null);
    const [productImages, setProductImages] = useState<ProductImage[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<ProductCardType[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");
    const [openAccordion, setOpenAccordion] = useState<string | null>("description");
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

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
                                image: `https://palegoldenrod-wombat-569197.hostingersite.com/${item.product_thambnail}`,
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
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E31E24]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-white">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
                <Link href="/products" className="text-[#E31E24] hover:underline">
                    Back to all products
                </Link>
            </div>
        );
    }

    const hasDiscount = product.discount_price !== null;
    const currentPrice = hasDiscount ? product.discount_price : product.selling_price;
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

    return (
        <div className="bg-white min-h-screen pb-12">
            {/* Breadcrumbs */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center text-sm text-gray-400">
                    <span className="cursor-pointer hover:text-gray-900">Delmon</span>
                    <span className="mx-2">{'>'}</span>
                    <Link href="/" className="cursor-pointer hover:text-gray-900">Home</Link>
                    {product.category && (
                        <>
                            <span className="mx-2">{'>'}</span>
                            <Link href="/products" className="cursor-pointer hover:text-gray-900">{product.category.category_name}</Link>
                        </>
                    )}
                    <span className="mx-2">{'>'}</span>
                    <span className="text-gray-800">{product.product_name}</span>
                </div>
            </div>



            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column - Image Gallery */}
                    <div className="lg:col-span-6 xl:col-span-5">
                        <div className="bg-[#F8F8F8] rounded-3xl overflow-hidden mb-4 p-8 flex items-center justify-center aspect-square relative">
                            <img
                                src={`https://palegoldenrod-wombat-569197.hostingersite.com/${activeImage}`}
                                alt={product.product_name}
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                            {hasDiscount && (
                                <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    {discountPercent}% OFF
                                </span>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {allImages.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {allImages.map((img, index) => (
                                    <button
                                        key={img.id || index}
                                        className={`w-20 h-24 shrink-0 bg-[#F8F8F8] rounded-xl flex items-center justify-center p-2 border-2 transition-all ${activeImage === img.photo_name ? 'border-gray-400' : 'border-transparent hover:border-gray-200'
                                            }`}
                                        onClick={() => setActiveImage(img.photo_name)}
                                    >
                                        <img
                                            src={`https://palegoldenrod-wombat-569197.hostingersite.com/${img.photo_name}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="lg:col-span-6 xl:col-start-7 xl:col-span-6">
                        <div className="h-full flex flex-col">
                            <span className="text-gray-500 text-sm font-medium mb-1 block">
                                Shop All {product.category?.category_name || "School Items"}
                            </span>

                            <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-4 font-serif tracking-wide">
                                {product.product_name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-5 h-5 fill-current" />
                                    ))}
                                </div>
                                <span className="text-gray-500 text-sm font-medium">+100 Bought</span>
                            </div>

                            <div className="flex items-baseline gap-3 mb-8">
                                <span className="text-2xl font-bold text-[#E31E24]">AED {currentPrice}</span>
                                {hasDiscount && (
                                    <span className="text-lg text-gray-400 line-through">AED {product.selling_price}</span>
                                )}
                            </div>

                            <div className="h-px bg-gray-200 w-full mb-8"></div>

                            {/* Color Selection */}
                            {colors.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-base text-gray-900 font-medium">Color :</span>
                                        <div className="flex items-center gap-2">
                                            {colors.map((color) => {
                                                const clrLower = color.toLowerCase();
                                                const bg = colorMap[clrLower] || clrLower;
                                                return (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ${selectedColor === color ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                                                        style={{ backgroundColor: bg }}
                                                        title={color}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {sizes.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-base text-gray-900 font-medium">Size :</span>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-4 py-2 rounded-lg border transition-all focus:outline-none ${selectedSize === size
                                                        ? 'border-gray-900 bg-gray-900 text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="h-px bg-gray-200 w-full mb-8"></div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-4 mb-10">
                                <div className="flex items-center border border-gray-300 rounded-full h-12 px-2 bg-gray-50">
                                    <span className="text-gray-500 px-3 text-sm">Qty {quantity}</span>
                                    <div className="flex flex-col ml-2">
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="text-gray-500 hover:text-gray-800 p-0.5 leading-none"
                                        >
                                            <ChevronUp className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="text-gray-500 hover:text-gray-800 p-0.5 leading-none"
                                        >
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={cartLoading}
                                    className="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium h-12 px-8 rounded-full transition-colors shadow-sm text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {cartLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add To Cart"
                                    )}
                                </button>

                                <div className="flex items-center gap-2">
                                    <button className="w-12 h-12 rounded-xl bg-[#E8F3ED] flex items-center justify-center text-gray-600 hover:text-[#E31E24] transition-colors border border-[#d6eadd]">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                    <button className="w-12 h-12 rounded-xl bg-[#E8F3ED] flex items-center justify-center text-gray-600 hover:text-[#E31E24] transition-colors border border-[#d6eadd]">
                                        <ArrowRightLeft className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Details Accordion */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Details</h3>

                                <ProductAccordion
                                    title="Description"
                                    content={product.long_description}
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
                                    title="Review"
                                    content={<div className="text-gray-500 italic">No reviews yet.</div>}
                                    isOpen={openAccordion === "review"}
                                    onClick={() => toggleAccordion("review")}
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}