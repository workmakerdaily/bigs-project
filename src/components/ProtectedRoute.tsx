"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken, getRefreshToken, refreshAccessToken } from "@/services/authService";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname(); // 현재 경로 가져오기
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 보호 예외 페이지 (로그인 & 회원가입 페이지)
    const publicRoutes = ["/", "/signup"];

    useEffect(() => {
        // 로그인 또는 회원가입 페이지는 보호하지 않음
        if (publicRoutes.includes(pathname)) {
            setIsLoading(false);
            return;
        }

        const checkAuth = async () => {
            const accessToken = getAccessToken();
            const refreshToken = getRefreshToken();

            if (!accessToken) {
                if (refreshToken) {
                    // refreshToken이 있다면 accessToken 재발급 시도
                    const newAccessToken = await refreshAccessToken();
                    if (!newAccessToken) {
                        setIsAuthenticated(false); // 인증 실패
                    } else {
                        setIsAuthenticated(true); // 인증 성공
                    }
                } else {
                    setIsAuthenticated(false); // 인증 실패
                }
            } else {
                setIsAuthenticated(true); // 인증 성공
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [pathname]); // pathname 변경될 때마다 검사

    useEffect(() => {
        if (!isLoading && !isAuthenticated && !publicRoutes.includes(pathname)) {
            router.push("/");
        }
    }, [isLoading, isAuthenticated, pathname, router]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return <>{children}</>;
}
