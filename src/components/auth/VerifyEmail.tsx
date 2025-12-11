"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { verifyEmailApi } from "@/src/service/authApi";

export default function VerifyEmailPage() {
    const { id, hash } = useParams<{ id: string; hash: string }>();
    const router = useRouter();

    const [status, setStatus] = useState<
        "loading" | "success" | "error"
    >("loading");

    useEffect(() => {
        async function verify() {
            try {
                await verifyEmailApi(id, hash);
                setStatus("success");

                setTimeout(() => router.push("/login"), 3000);
            } catch (err) {
                setStatus("error");
            }
        }

        verify();
    }, [id, hash, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow text-center space-y-4 max-w-md">

                {status === "loading" && (
                    <p className="text-gray-600">
                        Verifying your email...
                    </p>
                )}

                {status === "success" && (
                    <>
                        <h2 className="text-green-600 text-xl font-semibold">
                            ✅ Email Verified Successfully
                        </h2>
                        <p className="text-gray-500">
                            Redirecting you to login...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h2 className="text-red-600 text-xl font-semibold">
                            ❌ Verification Failed
                        </h2>
                        <p className="text-gray-500">
                            Invalid or expired verification link.
                        </p>
                    </>
                )}

            </div>
        </div>
    );
}

