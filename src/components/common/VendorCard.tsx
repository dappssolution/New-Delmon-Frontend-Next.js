import Link from "next/link";
import { ArrowRight, Phone, Calendar } from "lucide-react";
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
        <div className="group bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Header with gradient background and image */}
            <div className="bg-gradient-to-r from-[#5fae87] to-[#4a9b70] h-32 sm:h-40 md:h-48 flex items-center justify-center relative overflow-hidden">
                {photo ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}/upload/vendor_images/${photo}`}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <>
                        {/* Decorative pattern overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>
                        <div className="relative z-10">
                            <Image
                                src='/delmon white.png'
                                alt={name}
                                width={120}
                                height={70}
                                className="object-contain sm:w-[150px] sm:h-[88px] md:w-[170px] md:h-[100px]"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-2.5 md:space-y-3">
                {/* Since badge */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 flex-shrink-0" />
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        Since {new Date(vendor_join).getFullYear()}
                    </p>
                </div>

                {/* Vendor name */}
                <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg group-hover:text-green-600 transition-colors leading-tight line-clamp-2">
                    {name}
                </h3>

                {/* Phone number */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                    <p className="text-xs sm:text-sm truncate">{phone}</p>
                </div>

                {/* Visit Store Button */}
                <Link
                    href={`/vendor/${id}`}
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg group/btn mt-2 sm:mt-3 md:mt-4"
                >
                    <span>Visit Store</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}