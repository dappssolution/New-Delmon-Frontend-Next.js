"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useRedux";
import { RootState } from "@/src/redux/store";
import { getAuthToken } from "@/src/utils/authCookies";
import { fetchUserProfile } from "@/src/redux/auth/authThunk";
import Loading from "@/src/components/common/Loading";
import { UserData } from "@/src/types/user.types";

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps pages that require authentication.
 * If user is not logged in (no token), redirects to login page.
 * 
 * Usage:
 * ```tsx
 * <ProtectedRoute>
 *   <YourPageContent />
 * </ProtectedRoute>
 * ```
 */
export default function ProtectedRoute({
    children,
    redirectTo = "/login",
}: ProtectedRouteProps) {

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { token, user, loading: authLoading } = useAppSelector((state: RootState) => state.auth);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const cookieToken = getAuthToken();
        const hasToken = Boolean(token || cookieToken);

        const checkAuth = async () => {
            if (!hasToken) {
                const currentPath = window.location.pathname;
                sessionStorage.setItem("redirectAfterLogin", currentPath);

                const separator = redirectTo.includes('?') ? '&' : '?';
                router.replace(`${redirectTo}${separator}redirect=${encodeURIComponent(currentPath)}`);
                setIsAuthenticated(false);
                setIsChecking(false);
            } else {
                if (!user && !authLoading) {
                    try {
                        await dispatch(fetchUserProfile()).unwrap();
                    } catch (error) {
                        console.error("Failed to fetch profile:", error);
                    }
                }

                if (user) {
                    const currentUser = user as unknown as UserData;
                    if (currentUser.email_verified_at === null && !pathname.startsWith("/verify-email")) {
                        router.replace("/verify-email/0/0");
                        return;
                    }
                }

                setIsAuthenticated(true);
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [token, user, router, redirectTo, dispatch, authLoading]);

    if (isChecking || (isAuthenticated && !user && authLoading)) {
        return <Loading fullScreen />;
    }

    if (!isAuthenticated) {
        return <Loading fullScreen />;
    }

    return <>{children}</>;
}
