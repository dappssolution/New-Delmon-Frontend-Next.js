"use client";

import Pagination from "@/src/components/common/Pagination";
import { homeApi } from "@/src/service/homeApi";
import { AllCategoriesResponse } from "@/src/types/category.types";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function CategoriesPage() {
    const [categoriesData, setCategoriesData] =
        useState<AllCategoriesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedCategories, setExpandedCategories] = useState<{
        [key: number]: boolean;
    }>({});
    const [expandedSubCategories, setExpandedSubCategories] = useState<{
        [key: number]: boolean;
    }>({});

    useEffect(() => {
        fetchCategories(currentPage);
    }, [currentPage]);

    const fetchCategories = async (page: number) => {
        setLoading(true);
        try {
            const data = await homeApi.getAllCategories(10, page);
            setCategoriesData(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const toggleSubCategory = (subCategoryId: number) => {
        setExpandedSubCategories((prev) => ({
            ...prev,
            [subCategoryId]: !prev[subCategoryId],
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    if (!categoriesData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-gray-500">No categories found</p>
            </div>
        );
    }

    const isAnyCategoryExpanded = Object.values(expandedCategories).some(Boolean);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Hidden on mobile, efficient on desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
                            {/* Main Categories Header */}
                            <div className="bg-green-700 text-white p-4">
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                    <span className="text-xl">☰</span>
                                    All Categories
                                </h2>
                                <p className="text-xs text-green-100 mt-1">
                                    Welcome to our office supplies
                                </p>
                            </div>

                            {/* Categories List */}
                            <div className="divide-y divide-gray-200">
                                {categoriesData.data.map((mainCategory) => (
                                    <div key={mainCategory.id}>
                                        {/* Main Category */}
                                        <button
                                            onClick={() => toggleCategory(mainCategory.id)}
                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <span className="font-medium text-gray-900 text-sm">
                                                {mainCategory.main_category_name}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-400 transition-transform ${expandedCategories[mainCategory.id]
                                                        ? "rotate-180"
                                                        : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* Categories */}
                                        {expandedCategories[mainCategory.id] && (
                                            <div className="bg-gray-50">
                                                {mainCategory.categories.map((category) => (
                                                    <div key={category.id}>
                                                        {/* Category */}
                                                        <button
                                                            onClick={() => category.sub_categories.length > 0 && toggleSubCategory(category.id)}
                                                            className={`w-full px-6 py-2.5 flex items-center justify-between hover:bg-gray-100 transition-colors text-left ${category.sub_categories.length === 0 ? 'cursor-default' : ''}`}
                                                        >
                                                            <span className="text-gray-700 text-sm">
                                                                {category.category_name}
                                                            </span>
                                                            {category.sub_categories.length > 0 && (
                                                                <ChevronRight
                                                                    className={`w-3 h-3 text-gray-400 transition-transform ${expandedSubCategories[category.id]
                                                                            ? "rotate-90"
                                                                            : ""
                                                                        }`}
                                                                />
                                                            )}
                                                        </button>

                                                        {/* Sub Categories */}
                                                        {expandedSubCategories[category.id] &&
                                                            category.sub_categories.length > 0 && (
                                                                <div className="bg-white">
                                                                    {category.sub_categories.map((subCategory) => (
                                                                        <Link
                                                                            key={subCategory.id}
                                                                            href={`/category/${subCategory.subcategory_slug}`}
                                                                            className="w-full px-8 py-2 flex items-center hover:bg-gray-50 transition-colors text-left block"
                                                                        >
                                                                            <span className="text-gray-600 text-xs">
                                                                                {subCategory.subcategory_name}
                                                                            </span>
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {!isAnyCategoryExpanded ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoriesData.data.map((mainCategory) => (
                                    <Link href={`/main-category/${mainCategory.main_category_slug}`}
                                        key={mainCategory.id}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                            {mainCategory.main_category_image ? (
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${mainCategory.main_category_image}`}
                                                    alt={mainCategory.main_category_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-6xl">📦</div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {mainCategory.main_category_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {mainCategory.categories.length}{" "}
                                                {mainCategory.categories.length === 1
                                                    ? "category"
                                                    : "categories"}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {categoriesData.data.map((mainCategory) => {
                                    if (!expandedCategories[mainCategory.id]) return null;

                                    return (
                                        <div key={mainCategory.id}>
                                            {!mainCategory.categories.some(
                                                (cat) => expandedSubCategories[cat.id]
                                            ) ? (
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                                        {mainCategory.main_category_name}
                                                    </h2>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {mainCategory.categories.map((category) => (
                                                            <Link
                                                                key={category.id}
                                                                href={`/category/${category.category_slug}`}
                                                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                                            >
                                                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                                                    {category.category_image ? (
                                                                        <img
                                                                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${category.category_image}`}
                                                                            alt={category.category_name}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="text-6xl">📂</div>
                                                                    )}
                                                                </div>
                                                                <div className="p-4">
                                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                                        {category.category_name}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        {category.sub_categories.length}{" "}
                                                                        {category.sub_categories.length === 1
                                                                            ? "subcategory"
                                                                            : "subcategories"}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                mainCategory.categories.map((category) => {
                                                    if (!expandedSubCategories[category.id]) return null;

                                                    return (
                                                        <div key={category.id}>
                                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                                                {category.category_name}
                                                            </h2>
                                                            <p className="text-gray-600 mb-6">
                                                                {mainCategory.main_category_name}
                                                            </p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                {category.sub_categories.map((subCategory) => (
                                                                    <Link
                                                                        key={subCategory.id}
                                                                        href={`/sub-category/${subCategory.subcategory_slug}`}
                                                                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                                                    >
                                                                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                                                            <div className="text-6xl">📄</div>
                                                                        </div>
                                                                        <div className="p-4">
                                                                            <h3 className="font-semibold text-gray-900">
                                                                                {subCategory.subcategory_name}
                                                                            </h3>
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        {categoriesData.meta.last_page > 1 && (
                            <Pagination
                                currentPage={categoriesData.meta.current_page}
                                lastPage={categoriesData.meta.last_page}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}