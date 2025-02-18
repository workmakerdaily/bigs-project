import axios from "axios";
import { refreshAccessToken, logout } from "@/services/authService";
import { parseCookies, setCookie } from "nookies";

const api = axios.create({
    baseURL: "https://front-mission.bigs.or.kr",
    headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터: `accessToken` 자동 추가
api.interceptors.request.use(async (config) => {
    let cookies = parseCookies();
    let accessToken = cookies.accessToken;

    if (!accessToken) {
        console.log("⚠️ AccessToken 없음 → RefreshToken으로 갱신 시도...");
        try {
            accessToken = await refreshAccessToken(); // 새 accessToken 발급
        } catch (error) {
            console.warn("🚨 자동 갱신 실패 → 로그아웃");
            logout();
            return Promise.reject(error);
        }
    }

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// 응답 인터셉터 (accessToken 만료 시 자동 갱신)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log("🔄 AccessToken 만료, RefreshToken을 사용하여 재발급 요청...");
                const newAccessToken = await refreshAccessToken();

                // 새로운 accessToken을 쿠키에 저장
                setCookie(null, "accessToken", newAccessToken, {
                    maxAge: 60 * 60 * 24, // 1일
                    path: "/",
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });

                console.log("✅ 새로운 AccessToken 저장 완료:", newAccessToken);

                // 요청에 새로운 토큰 적용 후 재시도
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("❌ RefreshToken 만료 또는 사용 불가, 로그아웃 처리");
                logout();
            }
        }

        return Promise.reject(error);
    }
);

export default api;
