"use client";

import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

export default function ContractSuccessPage() {
    return (
        <ProtectedRoute>
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-[1400px] w-full border border-[#8fccab] rounded-[20px] p-8 md:p-12">

                <div className="text-xs text-gray-500 mb-8">
                    Delmon &gt; Home &gt; Request to Access Contract
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                    {/* Illustration */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <Image
                            src="/auth/contract-success.jpg"
                            alt="Contract Success"
                            width={400}
                            height={400}
                            className="object-contain"
                        />
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                        <h2 className="text-2xl font-bold text-[#114f30]">
                            Your request has been submitted
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Thankyou for submitting your request. Our team will review is as
                            soon as possible and grand you access. You will be notified via
                            email once your contract access has been improved
                        </p>

                        <div className="pt-4">
                            <Link
                                href="/"
                                className="inline-block bg-[#114f30] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#0d3d25] transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ProtectedRoute>
    );
}
