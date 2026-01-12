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

                {/* Alphabet Filter */}
                <div className="mb-8">
                    {/* First row - Numbers and A-P */}
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

                    {/* Second row - Q-Z */}
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

                {/* Brands Display */}
                <div className="space-y-8">
                    {Object.entries(displayBrands)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([letter, letterBrands]) => (
                            <div key={letter}>
                                {/* Letter Header */}
                                <div className="mb-4">
                                    <button className="w-10 h-10 bg-orange-500 text-white rounded-md font-bold text-lg">
                                        {letter}
                                    </button>
                                </div>

                                {/* Brand Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {letterBrands.map((brand) => (
                                        <Link
                                            key={brand.id}
                                            href={`/brand/${brand.brand_slug}`}
                                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group h-full"
                                        >
                                            {/* Brand Logo */}
                                            <div className="w-full h-32 flex items-center justify-center mb-4 relative">
                                                {brand.brand_image ? (
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${brand.brand_image}`}
                                                        alt={brand.brand_name}
                                                        fill
                                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                                        unoptimized={true}
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-md">
                                                        {brand.brand_name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Brand Name */}
                                            <p className="text-center text-base font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                                                {brand.brand_name}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>

                {/* Empty State */}
                {Object.keys(displayBrands).length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600 mb-4">
                            {selectedLetter
                                ? `No brands found for letter "${selectedLetter}"`
                                : "No brands available"}
                        </p>
                        {selectedLetter && (
                            <button
                                onClick={() => setSelectedLetter(null)}
                                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Show All Brands
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}