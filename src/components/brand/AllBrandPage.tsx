"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand, BrandData, BrandGetResponse } from "@/src/types/home.types";
import { homeApi } from "@/src/service/homeApi";
import Loading from "../common/Loading";


export default function AllBrandsPage() {
    const [brandsData, setBrandsData] = useState<BrandData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);

            const result = await homeApi.getBrands();

            if (result.success) {
                setBrandsData(result.data);
            } else {
                setError(result.message || "Failed to load brands");
            }
        } catch (err) {
            setError("Failed to load brands");
            console.error("Error fetching brands:", err);
        } finally {
            setLoading(false);
        }
    };

    const brandsByLetter = brandsData?.brands.reduce((acc, brand) => {
        const letter = brand.brand_name.charAt(0).toUpperCase();
        if (!acc[letter]) {
            acc[letter] = [];
        }
        acc[letter].push(brand);
        return acc;
    }, {} as Record<string, Brand[]>) || {};

    const availableLetters = brandsData?.letters || Object.keys(brandsByLetter);

    const alphabet = "3ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const displayBrands = selectedLetter
        ? { [selectedLetter]: brandsByLetter[selectedLetter] || [] }
        : brandsByLetter;

    if (loading) {
        return <Loading className="min-h-screen" />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchBrands}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Title */}
                <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
                    All Brands
                </h1>

                {/* Alphabet Filter - Commented out as requested */}
                {/* 
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-2 justify-center">
                        {alphabet.slice(0, 17).map((letter) => {
                            const isAvailable = availableLetters.includes(letter);
                            const isSelected = selectedLetter === letter;

                            return (
                                <button
                                    key={letter}
                                    onClick={() => setSelectedLetter(isSelected ? null : letter)}
                                    disabled={!isAvailable}
                                    className={`w-10 h-10 rounded-md font-semibold transition-colors ${isSelected
                                        ? "bg-orange-600 text-white"
                                        : isAvailable
                                            ? "bg-orange-500 text-white hover:bg-orange-600"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {alphabet.slice(17).map((letter) => {
                            const isAvailable = availableLetters.includes(letter);
                            const isSelected = selectedLetter === letter;

                            return (
                                <button
                                    key={letter}
                                    onClick={() => setSelectedLetter(isSelected ? null : letter)}
                                    disabled={!isAvailable}
                                    className={`w-10 h-10 rounded-md font-semibold transition-colors ${isSelected
                                        ? "bg-orange-600 text-white"
                                        : isAvailable
                                            ? "bg-orange-500 text-white hover:bg-orange-600"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                </div>
                */}

                {/* Brands Display - Flattened Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {brandsData?.brands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/brand/${brand.brand_slug}`}
                            className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group h-full"
                        >
                            {/* Brand Logo */}
                            <div className="w-full h-20 flex items-center justify-center mb-2 relative">
                                {brand.brand_image ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${brand.brand_image}`}
                                        alt={brand.brand_name}
                                        fill
                                        className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                        unoptimized={true}
                                        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 12vw"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                        {brand.brand_name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Brand Name */}
                            <p className="text-center text-[10px] sm:text-xs font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                                {brand.brand_name}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {(!brandsData?.brands || brandsData.brands.length === 0) && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600 mb-4">
                            No brands available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}