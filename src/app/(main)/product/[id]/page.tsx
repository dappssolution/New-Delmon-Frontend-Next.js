"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Heart, Minus, Plus, Share2 } from "lucide-react";
import { homeApi } from "../../../../service/homeApi";
import ProductCard, { Product as ProductCardType } from "../../../../components/common/ProductCard";
import Footer from "../../../../components/layout/Footer";

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

export default function ProductDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<ProductData | null>(null);
    const [productImages, setProductImages] = useState<ProductImage[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<ProductCardType[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState("");

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const response = await homeApi.getProductById(Number(id));
                
                if (response.success && response.data) {
                    // Set product from data.product
                    setProduct(response.data.product);
                    
                    // Set active image to thumbnail
                    setActiveImage(response.data.product.product_thambnail);
                    
                    // Set product images from data.images
                    if (response.data.images && response.data.images.length > 0) {
                        setProductImages(response.data.images);
                    }
                    
                    // Map related products from data.related
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

                            return {
                                id: item.id,
                                category: item.category_name || item.brand?.brand_name || "Uncategorized",
                                title: item.product_name,
                                price: `AED${finalPrice}`,
                                oldPrice: oldPrice ? `AED${oldPrice}` : undefined,
                                image: `https://palegoldenrod-wombat-569197.hostingersite.com/${item.product_thambnail}`,
                                badge: badge
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
        // Reset quantity when id changes
        setQuantity(1);
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0d6838]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
                <Link href="/products" className="text-[#0d6838] hover:underline">
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

    // Create array of all images (thumbnail + additional images)
    const allImages = [
        { id: 0, photo_name: product.product_thambnail },
        ...productImages
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
                        <Link href="/" className="hover:text-[#0d6838] transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                        <Link href="/products" className="hover:text-[#0d6838] transition-colors">Products</Link>
                        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                        <span className="text-gray-900 font-medium truncate">{product.product_name}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                <img
                                    src={`https://palegoldenrod-wombat-569197.hostingersite.com/${activeImage}`}
                                    alt={product.product_name}
                                    className="w-full h-full object-contain p-4"
                                />
                                {hasDiscount && (
                                    <span className="absolute top-4 left-4 bg-green-700 text-white text-sm font-bold px-3 py-1.5 rounded">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                            </div>
                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={img.id || index}
                                            className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${
                                                activeImage === img.photo_name ? 'border-[#0d6838]' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setActiveImage(img.photo_name)}
                                        >
                                            <img
                                                src={`https://palegoldenrod-wombat-569197.hostingersite.com/${img.photo_name}`}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.product_name}</h1>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                                        {product.brand?.brand_name}
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <span>★★★★☆</span>
                                        <span className="text-gray-400 ml-1">(4.5 Reviews)</span>
                                    </div>
                                    <span className={product.product_qty !== "0" ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                        {product.product_qty !== "0" ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-[#0d6838]">AED{currentPrice}</span>
                                    {hasDiscount && (
                                        <span className="text-xl text-gray-400 line-through">AED{product.selling_price}</span>
                                    )}
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    {product.short_description || "No description available."}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Quantity & Actions */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center border border-gray-300 rounded-md w-32">
                                        <button
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#0d6838]"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            readOnly
                                            className="w-12 text-center text-gray-900 font-medium focus:outline-none"
                                        />
                                        <button
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#0d6838]"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button className="flex-1 bg-[#0d6838] text-white font-bold h-10 px-8 rounded-md hover:bg-green-800 transition-colors flex items-center justify-center gap-2">
                                        Add to Cart
                                    </button>

                                    <button className="h-10 w-10 border border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                    <button className="h-10 w-10 border border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:text-[#0d6838] hover:border-[#0d6838] transition-colors">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 pt-6 space-y-3 text-sm text-gray-600">
                                    <div className="flex">
                                        <span className="w-32 font-medium text-gray-900">SKU:</span>
                                        <span>{product.product_code || "N/A"}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-32 font-medium text-gray-900">Category:</span>
                                        <span className="capitalize">{product.category?.category_name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Tabs Section */}
                    <div className="mt-12 md:mt-16">
                        <div className="border-b border-gray-200 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b-2 border-[#0d6838] inline-block">
                                Product Description
                            </h3>
                        </div>
                        <div
                            className="prose max-w-none text-gray-600"
                            dangerouslySetInnerHTML={{ __html: product.long_description }}
                        />
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 md:mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}