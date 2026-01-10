"use client";

import React, { useEffect, useState } from 'react';
import { ChevronRight, Upload, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux';
import { RootState } from '@/src/redux/store';
import { fetchAllBrands } from '@/src/redux/brand/brandThunk';
import { fetchAllCategory } from '@/src/redux/category/categoryThunk';
import { fetchAllSubCategories } from '@/src/redux/subCategory/subcategoryThunk';
import { vendorApis } from '@/src/service/vendorApi';
import { toast } from 'sonner';
import { fetchVendorProducts, updateVendorProduct } from '@/src/redux/vendor/vendorThunk';
import { useRouter } from 'next/navigation';

export default function EditProduct({ productId }: { productId: string }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { products, loading: productsLoading } = useAppSelector((state: RootState) => state.vendor);
    const { brands, loading: brandsLoading } = useAppSelector((state: RootState) => state.brand);
    const { categories, loading: categoryLoading } = useAppSelector((state: RootState) => state.category);
    const { subCategories, loading: subLoading } = useAppSelector((state: RootState) => state.subCategory);

    const [formData, setFormData] = useState({
        productName: '',
        productTag: '',
        productSize: '',
        productColor: '',
        shortDescription: '',
        longDescription: '',
        productPrice: '',
        discountPrice: '',
        productCode: '',
        productQuantity: '',
        productBrand: '',
        productCategory: '',
        productSubCategory: '',
        hotDeals: false,
        featured: false,
        specialOffer: false,
        specialDeals: false,
        status: 1,
        mainThumbnail: null as FileList | null,
        multiImages: null as FileList | null
    });

    const [brandOpen, setBrandOpen] = useState(false);
    const [brandSearch, setBrandSearch] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [subOpen, setSubOpen] = useState(false);
    const [subSearch, setSubSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastProductId, setLastProductId] = useState<string | null>(null);
    const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchAllBrands());
        dispatch(fetchAllCategory());
        dispatch(fetchAllSubCategories());
        dispatch(fetchVendorProducts({}));
    }, [dispatch]);

    useEffect(() => {
        if (products.length > 0 && lastProductId !== productId) {
            const product = products.find(p => p.id.toString() === productId);
            if (product) {
                setFormData({
                    productName: product.product_name || '',
                    productTag: product.product_tags || '',
                    productSize: product.product_size || '',
                    productColor: product.product_color || '',
                    shortDescription: product.short_description || '',
                    longDescription: product.long_description || '',
                    productPrice: product.selling_price || '',
                    discountPrice: product.discount_price || '',
                    productCode: product.product_code || '',
                    productQuantity: product.product_qty || '',
                    productBrand: product.brand_id?.toString() || '',
                    productCategory: product.category_id?.toString() || '',
                    productSubCategory: product.subcategory_id?.toString() || '',
                    hotDeals: Number(product.hot_deals) === 1,
                    featured: Number(product.featured) === 1,
                    specialOffer: Number(product.special_offer) === 1,
                    specialDeals: Number(product.special_deals) === 1,
                    status: Number(product.status),
                    mainThumbnail: null,
                    multiImages: null
                });
                setCurrentThumbnail(product.product_thambnail);
                setLastProductId(productId);
            }
        }
    }, [products, productId, lastProductId]);

    const filteredBrands = brands.filter((brand) =>
        brand.brand_name.toLowerCase().includes(brandSearch.toLowerCase())
    );

    const filteredCategories = categories.filter((cat) =>
        cat.category_name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const filteredSubCategories = subCategories
        .filter(sub => sub.category_id?.toString() === formData.productCategory)
        .filter(sub =>
            sub.subcategory_name.toLowerCase().includes(subSearch.toLowerCase())
        );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormData(prev => ({ ...prev, [fieldName]: files }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.productName || !formData.productPrice || !formData.productCode ||
            !formData.productQuantity || !formData.productBrand || !formData.productCategory) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('product_name', formData.productName);
            submitData.append('product_tags', formData.productTag);
            submitData.append('product_size', formData.productSize);
            submitData.append('product_color', formData.productColor);
            submitData.append('short_description', formData.shortDescription);
            submitData.append('long_description', formData.longDescription);
            submitData.append('selling_price', formData.productPrice);
            submitData.append('discount_price', formData.discountPrice);
            submitData.append('product_code', formData.productCode);
            submitData.append('product_qty', formData.productQuantity);
            submitData.append('brand_id', formData.productBrand);
            submitData.append('category_id', formData.productCategory);

            if (formData.productSubCategory) {
                submitData.append('subcategory_id', formData.productSubCategory);
            }

            submitData.append('hot_deals', formData.hotDeals ? '1' : '0');
            submitData.append('featured', formData.featured ? '1' : '0');
            submitData.append('special_offer', formData.specialOffer ? '1' : '0');
            submitData.append('special_deals', formData.specialDeals ? '1' : '0');
            submitData.append('status', formData.status.toString());

            if (formData.mainThumbnail && formData.mainThumbnail[0]) {
                submitData.append('product_thambnail', formData.mainThumbnail[0]);
            }

            if (formData.multiImages) {
                Array.from(formData.multiImages).forEach((file, index) => {
                    submitData.append(`multi_img[${index}]`, file as File);
                });
            }

            // Using thunk for better state management
            const resultAction = await dispatch(updateVendorProduct({ productId, productData: submitData }));

            if (updateVendorProduct.fulfilled.match(resultAction)) {
                toast.success('Product updated successfully!');
                router.push('/vendor/manage-products');
            } else {
                toast.error(resultAction.payload as string || 'Failed to update product');
            }
        } catch (error: any) {
            console.error('Error updating product:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (productsLoading && !lastProductId) {
        return (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
                <p className="text-gray-500 font-medium">Loading product data...</p>
            </div>
        );
    }

    if (!lastProductId && products.length > 0 && !productsLoading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                    <X className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h3>
                <p className="text-gray-500 mb-6">The product you are trying to edit does not exist or you don't have permission to view it.</p>
                <button
                    onClick={() => router.push('/vendor/manage-products')}
                    className="px-6 py-2 bg-[#0d6838] text-white rounded-lg hover:bg-[#0a5229] transition-colors"
                >
                    Back to Manage Products
                </button>
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>Delmon</span>
                <ChevronRight className="w-4 h-4" />
                <span>Vendor Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Edit Product</span>
            </div>

            {/* Page Title */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Product</h1>
                    <p className="text-gray-500 text-sm">Update your product information and media</p>
                </div>
                <button
                    onClick={() => router.push('/vendor/manage-products')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>

            <div className="bg-white rounded-xl border border-green-700 shadow-sm p-6 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">Basic Information</h3>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Product Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Tag</label>
                                <input
                                    type="text"
                                    name="productTag"
                                    value={formData.productTag}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Code <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="productCode"
                                    value={formData.productCode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Size</label>
                                <input
                                    type="text"
                                    name="productSize"
                                    value={formData.productSize}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Color</label>
                                <input
                                    type="text"
                                    name="productColor"
                                    value={formData.productColor}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Short Description</label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838] resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Long Description</label>
                            <textarea
                                name="longDescription"
                                value={formData.longDescription}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838] resize-none"
                            />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 pt-4 pb-2 border-b border-gray-100">Product Media</h3>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Main Thumbnail</label>
                            {currentThumbnail && !formData.mainThumbnail && (
                                <div className="mb-3 relative group w-32 h-32">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${currentThumbnail}`}
                                        alt="Current"
                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                        <p className="text-white text-xs font-medium">Current Image</p>
                                    </div>
                                </div>
                            )}
                            <div className="relative">
                                <input
                                    type="file"
                                    id="mainThumbnail"
                                    onChange={(e) => handleFileChange(e, 'mainThumbnail')}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="mainThumbnail"
                                    className="flex items-center w-full px-4 py-3 border border-dashed border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50 hover:border-[#0d6838] transition-all"
                                >
                                    <Upload className="w-5 h-5 text-gray-400 mr-3" />
                                    <span className="text-gray-500 font-medium">
                                        {formData.mainThumbnail ? formData.mainThumbnail[0]?.name : 'Upload new thumbnail (replaces current)'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Multi Images</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="multiImages"
                                    onChange={(e) => handleFileChange(e, 'multiImages')}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                />
                                <label
                                    htmlFor="multiImages"
                                    className="flex items-center w-full px-4 py-3 border border-dashed border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50 hover:border-[#0d6838] transition-all"
                                >
                                    <Upload className="w-5 h-5 text-gray-400 mr-3" />
                                    <span className="text-gray-500 font-medium">
                                        {formData.multiImages ? `${formData.multiImages.length} images selected` : 'Upload new gallery images'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">Inventory & Pricing</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Product Price <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="productPrice"
                                    value={formData.productPrice}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Discount Price</label>
                                <input
                                    type="text"
                                    name="discountPrice"
                                    value={formData.discountPrice}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Product Quantity <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="productQuantity"
                                value={formData.productQuantity}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                            />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 pt-4 pb-2 border-b border-gray-100">Taxonomy & Status</h3>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Product Brand <span className="text-red-500">*</span></label>
                            <div
                                onClick={() => setBrandOpen(!brandOpen)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 cursor-pointer bg-white flex justify-between items-center hover:border-gray-400"
                            >
                                <span>{formData.productBrand ? brands.find(b => b.id.toString() === formData.productBrand)?.brand_name : "Select Brand"}</span>
                                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${brandOpen ? 'rotate-90' : ''}`} />
                            </div>
                            {brandOpen && (
                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                                    <input
                                        type="text"
                                        placeholder="Search brand..."
                                        value={brandSearch}
                                        onChange={(e) => setBrandSearch(e.target.value)}
                                        className="w-full px-4 py-3 border-b border-gray-100 text-sm focus:outline-none"
                                    />
                                    <div className="max-h-60 overflow-y-auto">
                                        {brandsLoading && <div className="px-4 py-3 text-sm text-gray-500">Loading brands...</div>}
                                        {filteredBrands.map((brand) => (
                                            <div
                                                key={brand.id}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, productBrand: brand.id.toString() }));
                                                    setBrandOpen(false);
                                                }}
                                                className="px-4 py-2.5 text-sm text-gray-900 cursor-pointer hover:bg-green-50"
                                            >
                                                {brand.brand_name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Product Category <span className="text-red-500">*</span></label>
                            <div
                                onClick={() => setCategoryOpen(!categoryOpen)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 cursor-pointer bg-white flex justify-between items-center hover:border-gray-400"
                            >
                                <span>{formData.productCategory ? categories.find(c => c.id.toString() === formData.productCategory)?.category_name : "Select Category"}</span>
                                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${categoryOpen ? 'rotate-90' : ''}`} />
                            </div>
                            {categoryOpen && (
                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={categorySearch}
                                        onChange={(e) => setCategorySearch(e.target.value)}
                                        className="w-full px-4 py-3 border-b border-gray-100 text-sm focus:outline-none"
                                    />
                                    <div className="max-h-60 overflow-y-auto">
                                        {categoryLoading && <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>}
                                        {filteredCategories.map((cat) => (
                                            <div
                                                key={cat.id}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, productCategory: cat.id.toString(), productSubCategory: "" }));
                                                    setCategoryOpen(false);
                                                }}
                                                className="px-4 py-2.5 text-sm text-gray-900 cursor-pointer hover:bg-green-50"
                                            >
                                                {cat.category_name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Product Sub Category</label>
                            <div
                                onClick={() => formData.productCategory && setSubOpen(!subOpen)}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white flex justify-between items-center cursor-pointer hover:border-gray-400 ${!formData.productCategory ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "text-gray-900 border-gray-300"}`}
                            >
                                <span>{formData.productSubCategory ? subCategories.find(s => s.id.toString() === formData.productSubCategory)?.subcategory_name : "Select Sub Category"}</span>
                                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${subOpen ? 'rotate-90' : ''}`} />
                            </div>
                            {subOpen && formData.productCategory && (
                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                                    <input
                                        type="text"
                                        placeholder="Search sub category..."
                                        value={subSearch}
                                        onChange={(e) => setSubSearch(e.target.value)}
                                        className="w-full px-4 py-3 border-b border-gray-100 text-sm focus:outline-none"
                                    />
                                    <div className="max-h-60 overflow-y-auto">
                                        {subLoading && <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>}
                                        {filteredSubCategories.length === 0 && !subLoading && <div className="px-4 py-3 text-sm text-gray-400">No subcategories for this category</div>}
                                        {filteredSubCategories.map((sub) => (
                                            <div
                                                key={sub.id}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, productSubCategory: sub.id.toString() }));
                                                    setSubOpen(false);
                                                }}
                                                className="px-4 py-2.5 text-sm text-gray-900 cursor-pointer hover:bg-green-50"
                                            >
                                                {sub.subcategory_name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Product Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d6838]"
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Promotion Options</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-green-300 transition-colors">
                                    <input type="checkbox" name="hotDeals" checked={formData.hotDeals} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-[#0d6838] focus:ring-[#0d6838]" />
                                    <span className="text-sm text-gray-700 font-medium">Hot Deals</span>
                                </label>
                                <label className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-green-300 transition-colors">
                                    <input type="checkbox" name="specialOffer" checked={formData.specialOffer} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-[#0d6838] focus:ring-[#0d6838]" />
                                    <span className="text-sm text-gray-700 font-medium">Special Offer</span>
                                </label>
                                <label className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-green-300 transition-colors">
                                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-[#0d6838] focus:ring-[#0d6838]" />
                                    <span className="text-sm text-gray-700 font-medium">Featured</span>
                                </label>
                                <label className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-md cursor-pointer hover:border-green-300 transition-colors">
                                    <input type="checkbox" name="specialDeals" checked={formData.specialDeals} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-[#0d6838] focus:ring-[#0d6838]" />
                                    <span className="text-sm text-gray-700 font-medium">Special Deals</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#0d6838] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:bg-[#0a5229] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>UPDATING PRODUCT...</span>
                                    </>
                                ) : (
                                    'UPDATE PRODUCT'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
