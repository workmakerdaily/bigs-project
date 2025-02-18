import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { refreshAccessToken } from "@/services/authService";

const useProtectedRoute = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (pathname === "/signin" || pathname === "/signup") {
            setIsLoading(false);
            return;
        }

        const checkAuth = async () => {
            const cookies = parseCookies();
            let accessToken = cookies.accessToken;
            let refreshToken = cookies.refreshToken;

            console.log("🔍 현재 쿠키 상태:", cookies);

            if (!accessToken && refreshToken) {
                try {
                    console.log("🔄 AccessToken 없음 → RefreshToken으로 갱신 시도...");
                    const newAccessToken = await refreshAccessToken();

                    if (!newAccessToken) {
                        throw new Error("새로운 AccessToken을 받지 못함");
                    }

                    setCookie(null, "accessToken", newAccessToken, {
                        maxAge: 60 * 60 * 24, // 1일
                        path: "/",
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                    });

                    console.log("✅ 새로운 AccessToken 저장 완료:", newAccessToken);
                } catch (error: any) {
                    console.warn("🚨 RefreshToken도 만료됨 또는 사용 불가 → 로그아웃 처리");

                    if (error.response) {
                        console.error("🔴 서버 응답 상태 코드:", error.response.status, error.response.data);
                    } else {
                        console.error("🔴 응답이 없거나 네트워크 오류 발생:", error.message);
                    }

                    destroyCookie(null, "accessToken");
                    destroyCookie(null, "refreshToken");
                    router.push("/signin");
                }
            }

            setIsLoading(false);
        };

        // ✅ 여기에서 accessToken이 갱신된 후 다시 실행되지 않도록 설정
        checkAuth();
    }, [pathname]); // ✅ `accessToken`을 종속성 배열에서 제거하여 불필요한 실행 방지

    return { isLoading };
};

export default useProtectedRoute;
