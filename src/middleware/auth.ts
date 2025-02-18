import { parseCookies } from "nookies";
import { refreshAccessToken } from "@/services/authService";

// function: 사용자 인증 여부 확인 //
export const isAuthenticated = async () => {
    // variable: 쿠키에서 accessToken 가져오기 //
    const cookies = parseCookies();

    // accessToken이 존재하면 인증된 것으로 판단
    if (cookies.accessToken) {
        return true;
    }

    try {
        console.log("액세스 토큰 없음 → 리프레시 토큰으로 자동 로그인 시도...");
        // refreshToken을 이용하여 accessToken 갱신
        const newAccessToken = await refreshAccessToken();
        return !!newAccessToken; // 새로운 accessToken이 있으면 true 반환
    } catch {
        return false; // 토큰 갱신 실패 시 false 반환
    }
};
