import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface VendorCardProps {
    id: number;
    name: string;
    username: string;
    phone: string;
    vendor_join: string;
    photo?: string;
    productCount?: number;
}

export default function VendorCard({
    id,
    name,
    username,
    phone,
    vendor_join,
    photo,
    productCount = 0
}: VendorCardProps) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header with gradient background */}
            <div className="bg-linear-to-r from-[#5fae87] to-[#4a9b70] h-32 flex items-center justify-center relative">
                {photo ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/${photo}`}
                        alt={name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <Image
                        src='/delmon white.png'
                        alt={name}
                        width={170}
                        height={100}
                        className="rounded-full object-cover"
                    />
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <p className="text-xs text-gray-500">Since {new Date(vendor_join).getFullYear()}</p>
                <h3 className="font-semibold text-gray-900 text-base">{name}</h3>
                <p className="text-sm text-gray-600">Call Us: {phone}</p>
                <p className="text-xs text-gray-500">{productCount} Products</p>

                {/* Visit Store Button */}
                <Link
                    href={`/vendor/${id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-green-700 hover:text-green-700 transition-colors mt-2"
                >
                    Visit Store
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
