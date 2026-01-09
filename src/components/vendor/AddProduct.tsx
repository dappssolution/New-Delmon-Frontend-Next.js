"use client";

import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/useRedux';
import { RootState } from '@/src/redux/store';
import { fetchAllBrands } from '@/src/redux/brand/brandThunk';
import { fetchAllCategory } from '@/src/redux/category/categoryThunk';
import { fetchAllSubCategories } from '@/src/redux/subCategory/subcategoryThunk';
import { vendorApis } from '@/src/service/vendorApi';
import { toast } from 'sonner';

interface ProductFormData {
    productName: string;
    productTag: string;
    productSize: string;
    productColor: string;
    shortDescription: string;
    longDescription: string;
    productPrice: string;
    discountPrice: string;
    productCode: string;
    productQuantity: string;
    productBrand: string;
    productCategory: string;
    productSubCategory: string;
    hotDeals: boolean;
    featured: boolean;
    specialOffer: boolean;
    specialDeals: boolean;
    mainThumbnail: FileList | null;
    multiImages: FileList | null;
}

export default function AddProductPage() {
    const [formData, setFormData] = useState<ProductFormData>({
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
        mainThumbnail: null,
        multiImages: null
    });

    const dispatch = useAppDispatch();
    const { brands, loading } = useAppSelector((state: RootState) => state.brand);
    const { categories, loading: categoryLoading } =
        useAppSelector((state: RootState) => state.category);
    const [brandOpen, setBrandOpen] = useState(false);
    const [brandSearch, setBrandSearch] = useState("");

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");

    const { subCategories, loading: subLoading } =
        useAppSelector((state: RootState) => state.subCategory);

    const [subOpen, setSubOpen] = useState(false);
    const [subSearch, setSubSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchAllBrands());
        dispatch(fetchAllCategory());
        dispatch(fetchAllSubCategories());
    }, [dispatch]);

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
            setFormData(prev => ({ ...prev, [name]: checked } as unknown as ProductFormData));
        } else {
            setFormData(prev => ({ ...prev, [name]: value } as unknown as ProductFormData));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormData(prev => ({ ...prev, [fieldName]: files } as unknown as ProductFormData));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.productName || !formData.productPrice || !formData.productCode ||
            !formData.productQuantity || !formData.productBrand || !formData.productCategory) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!formData.mainThumbnail) {
            toast.error('Please upload a main thumbnail image');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();

            // Add text fields with API expected names
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

            // Add boolean fields (convert to 1/0)
            submitData.append('hot_deals', formData.hotDeals ? '1' : '0');
            submitData.append('featured', formData.featured ? '1' : '0');
            submitData.append('special_offer', formData.specialOffer ? '1' : '0');
            submitData.append('special_deals', formData.specialDeals ? '1' : '0');

            // Add main thumbnail
            if (formData.mainThumbnail && formData.mainThumbnail[0]) {
                submitData.append('product_thambnail', formData.mainThumbnail[0]);
            }

            // Add multiple images
            if (formData.multiImages) {
                Array.from(formData.multiImages).forEach((file, index) => {
                    submitData.append(`multi_img[${index}]`, file as File);
                });
            }

            const response = await vendorApis.createProduct(submitData);

            if (response.status) {
                toast.success(`Product "${response.data.product_name}" added successfully!`);

                // Reset form
                setFormData({
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
                    mainThumbnail: null,
                    multiImages: null
                });

            }
        } catch (error: any) {
            console.error('Error adding product:', error);
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to add product');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full px-4 sm:px-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <span>Delmon</span>
                <ChevronRight className="w-4 h-4" />
                <span>Vendor Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Add Product</span>
            </div>

            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back !</h1>
                <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            </div>

            {/* Add Product Form */}
            <div className="bg-white rounded-xl border border-green-700 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Add New Product</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="productName"
                                placeholder="Enter Product Title"
                                value={formData.productName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent"
                            />
                        </div>

                        {/* Product Tag */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Product Tag
                            </label>
                            <input
                                type="text"
                                name="productTag"
                                placeholder="Enter Product Title"
                                value={formData.productTag}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent"
                            />
                        </div>

                        {/* Product Size */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Product Size
                            </label>
                            <input
                                type="text"
                                name="productSize"
                                placeholder="Enter Product Title"
                                value={formData.productSize}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent"
                            />
                        </div>

                        {/* Product Color */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Product Color
                            </label>
                            <input
                                type="text"
                                name="productColor"
                                placeholder="Enter Product Title"
                                value={formData.productColor}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent"
                            />
                        </div>

                        {/* Short Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Short Description
                            </label>
                            <textarea
                                name="shortDescription"
                                placeholder="Enter Product Title"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Long Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Long Description
                            </label>
                            <textarea
                                name="longDescription"
                                placeholder="Enter Product Title"
                                value={formData.longDescription}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Main Thumbnail */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Main Thambnail
                            </label>
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
                                    className="flex items-center w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
                                >
                                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs mr-3">
                                        Choose File
                                    </span>
                                    <span className="text-gray-500">
                                        {formData.mainThumbnail ? formData.mainThumbnail[0]?.name : 'No file chosen'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Multi Images */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Multi Images
                            </label>
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
                                    className="flex items-center w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
                                >
                                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs mr-3">
                                        Choose File
                                    </span>
                                    <span className="text-gray-500">
                                        {formData.multiImages ? `${formData.multiImages.length} file(s) chosen` : 'No file chosen'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Product Price and Discount Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Product Price
                                </label>
                                <input
                                    type="text"
                                    name="productPrice"
                                    placeholder="00 : 00"
                                    value={formData.productPrice}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Discount Price
                                </label>
                                <input
                                    type="text"
                                    name="discountPrice"
                                    placeholder="00 : 00"
                                    value={formData.discountPrice}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Product Code and Quantity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Product Code
                                </label>
                                <input
                                    type="text"
                                    name="productCode"
                                    placeholder="00 : 00"
                                    value={formData.productCode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Product Quantity
                                </label>
                                <input
                                    type="text"
                                    name="productQuantity"
                                    placeholder="00 : 00"
                                    value={formData.productQuantity}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d6838] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Product Brand */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Product Brand
                            </label>

                            {/* Selected value */}
                            <div
                                onClick={() => setBrandOpen(!brandOpen)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 cursor-pointer bg-white flex justify-between items-center"
                            >
                                <span>
                                    {formData.productBrand
                                        ? brands.find(b => b.id.toString() === formData.productBrand)?.brand_name
                                        : "Select Brand"}
                                </span>
                                <span className="text-gray-400">▾</span>
                            </div>

                            {/* Dropdown */}
                            {brandOpen && (
                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">

                                    {/* Search */}
                                    <input
                                        type="text"
                                        placeholder="Search brand..."
                                        value={brandSearch}
                                        onChange={(e) => setBrandSearch(e.target.value)}
                                        className="w-full px-3 py-2 border-b border-gray-200 text-sm text-gray-900 bg-white focus:outline-none"
                                    />

                                    {/* List */}
                                    <div className="max-h-56 overflow-y-auto">
                                        {loading && (
                                            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                                        )}

                                        {!loading && filteredBrands.length === 0 && (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                No brands found
                                            </div>
                                        )}

                                        {filteredBrands.map((brand) => (
                                            <div
                                                key={brand.id}
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        productBrand: brand.id.toString()
                                                    }));
                                                    setBrandOpen(false);
                                                    setBrandSearch("");
                                                }}
                                                className="px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-green-50"
                                            >
                                                {brand.brand_name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Product Category */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Product Category
                            </label>

                            {/* Selected value */}
                            <div
                                onClick={() => setCategoryOpen(!categoryOpen)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 cursor-pointer bg-white flex justify-between items-center"
                            >
                                <span>
                                    {formData.productCategory
                                        ? categories.find(c => c.id.toString() === formData.productCategory)
                                            ?.category_name
                                        : "Select Category"}
                                </span>
                                <span className="text-gray-400">▾</span>
                            </div>

                            {/* Dropdown */}
                            {categoryOpen && (
                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">

                                    {/* Search */}
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={categorySearch}
                                        onChange={(e) => setCategorySearch(e.target.value)}
                                        className="w-full px-3 py-2 border-b border-gray-200 text-sm text-gray-900 bg-white focus:outline-none"
                                    />

                                    {/* List */}
                                    <div className="max-h-56 overflow-y-auto">
                                        {categoryLoading && (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                Loading...
                                            </div>
                                        )}

                                        {!categoryLoading && filteredCategories.length === 0 && (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                No categories found
                                            </div>
                                        )}

                                        {filteredCategories.map((cat) => (
                                            <div
                                                key={cat.id}
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        productCategory: cat.id.toString(),
                                                        productSubCategory: "" // reset subcategory if needed
                                                    }));
                                                    setCategoryOpen(false);
                                                    setCategorySearch("");
                                                }}
                                                className="px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-green-50"
                                            >
                                                {cat.category_name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Product Sub Category */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Product Sub Category
                            </label>

                            <div
                                onClick={() => {
                                    if (!formData.productCategory) return;
                                    setSubOpen(!subOpen);
                                }}
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white flex justify-between items-center cursor-pointer
      ${!formData.productCategory ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "text-gray-900 border-gray-300"}
    `}
                            >
                                <span>
                                    {formData.productSubCategory
                                        ? subCategories.find(
                                            s => s.id.toString() === formData.productSubCategory
                                        )?.subcategory_name
                                        : "Select Sub Category"}
                                </span>
                                <span className="text-gray-400">▾</span>
                            </div>

                            {subOpen && formData.productCategory && (
                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">

                                    {/* Search */}
                                    <input
                                        type="text"
                                        placeholder="Search sub category..."
                                        value={subSearch}
                                        onChange={(e) => setSubSearch(e.target.value)}
                                        className="w-full px-3 py-2 border-b border-gray-200 text-sm text-gray-900 bg-white focus:outline-none"
                                    />

                                    {/* List */}
                                    <div className="max-h-56 overflow-y-auto">
                                        {subLoading && (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                Loading...
                                            </div>
                                        )}

                                        {!subLoading && filteredSubCategories.length === 0 && (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                No sub categories found
                                            </div>
                                        )}

                                        {filteredSubCategories.map((sub) => (
                                            <div
                                                key={sub.id}
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        productSubCategory: sub.id.toString(),
                                                    }));
                                                    setSubOpen(false);
                                                    setSubSearch("");
                                                }}
                                                className="px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-green-50"
                                            >
                                                {sub.subcategory_name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* Checkboxes */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hotDeals"
                                        checked={formData.hotDeals}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 rounded border-gray-300 text-[#0d6838] focus:ring-[#0d6838]"
                                    />
                                    <span className="text-sm text-gray-700">Hot Deals</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="specialOffer"
                                        checked={formData.specialOffer}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 rounded border-gray-300 text-[#0d6838] focus:ring-[#0d6838]"
                                    />
                                    <span className="text-sm text-gray-700">Special Offer</span>
                                </label>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 rounded border-gray-300 text-[#0d6838] focus:ring-[#0d6838]"
                                    />
                                    <span className="text-sm text-gray-700">Featured</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="specialDeals"
                                        checked={formData.specialDeals}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 rounded border-gray-300 text-[#0d6838] focus:ring-[#0d6838]"
                                    />
                                    <span className="text-sm text-gray-700">Special Deals</span>
                                </label>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-6">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-3 bg-[#0d6838] text-white font-semibold rounded-lg hover:bg-[#0a5229] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    'Save Product'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}