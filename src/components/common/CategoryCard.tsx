import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShoppingBag } from "lucide-react";

interface CategoryCardProps {
    name: string;
    slug: string;
    image?: string;
    type?: "category" | "subcategory";
}

export default function CategoryCard({ name, slug, image, type = "subcategory" }: CategoryCardProps) {
    return (
        <Link href={`/category/${slug}`} className="group">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                    {image ? (
                        <Image 
                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${image}`}
                            alt={name}
                            width={200}
                            height={200}
                            className="object-contain group-hover:scale-105 transition-transform"
                        />
                    ) : (
                        <ShoppingBag className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">
                            View Products
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
