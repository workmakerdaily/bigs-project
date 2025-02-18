"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken, getRefreshToken, refreshAccessToken } from "@/services/authService";
import LoadingSpinner from "./LoadingSpinner";

// component: 보호된 라우트 (인증이 필요한 페이지 접근 보호) //
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

    // variable: 라우터 및 현재 경로 //
    const router = useRouter();
    const pathname = usePathname();

    // state: 로딩 상태 //
    const [isLoading, setIsLoading] = useState(true);

    // state: 인증 여부 //
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // variable: 보호 예외 페이지 (로그인 & 회원가입 페이지) //
    const publicRoutes = ["/", "/signup"];

    // effect: 인증 상태 확인 //
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

    // effect: 인증되지 않은 사용자가 보호된 경로에 접근 시 로그인 페이지로 리다이렉트 //
    useEffect(() => {
        if (!isLoading && !isAuthenticated && !publicRoutes.includes(pathname)) {
            router.push("/");
        }
    }, [isLoading, isAuthenticated, pathname, router]);

    // render: 로딩 화면 //
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // render: 인증된 사용자만 children을 렌더링 //
    return <>{children}</>;
}
