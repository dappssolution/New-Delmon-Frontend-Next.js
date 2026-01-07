"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { setToken } from "@/src/redux/auth/authSlice";
import { fetchUserProfile } from "@/src/redux/auth/authThunk";
import Loading from "@/src/components/common/Loading";
import { toast } from "sonner";

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            dispatch(setToken(token));

            dispatch(fetchUserProfile())
                .unwrap()
                .then(() => {
                    toast.success("Logged in with Google successfully!");
                    router.push("/");
                })
                .catch((err) => {
                    console.error("Failed to fetch user profile:", err);
                    toast.error("Failed to sync your profile. Please try again.");
                    router.push("/login");
                });
        } else {
            toast.error("Google authentication failed. No token received.");
            router.push("/login");
        }
    }, [searchParams, dispatch, router]);

    return <Loading fullScreen />;
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<Loading fullScreen />}>
            <GoogleCallbackContent />
        </Suspense>
    );
}
