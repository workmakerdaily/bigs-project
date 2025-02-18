import { parseCookies } from "nookies";
import { refreshAccessToken } from "@/services/authService";

export const isAuthenticated = async () => {
    const cookies = parseCookies();
    if (cookies.accessToken) {
        return true;
    }

    try {
        console.log("🔄 액세스 토큰 없음 → 리프레시 토큰으로 자동 로그인 시도...");
        const newAccessToken = await refreshAccessToken();
        return !!newAccessToken;
    } catch {
        return false;
    }
};
