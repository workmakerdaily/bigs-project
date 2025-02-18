import { SignIn, SignUp } from "@/types";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import api from "./api";

let refreshTokenPromise: Promise<string> | null = null;

export const signUpRequest = async (data: SignUp) => {
    try {
        console.log("회원가입 요청 데이터:", JSON.stringify(data));

        const response = await api.post("/auth/signup", data);
        console.log("회원가입 응답:", response.data);

        return response.status === 200;
    } catch (error: any) {
        console.error("회원가입 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "회원가입에 실패했습니다.");
    }
};

export const signInRequest = async (data: SignIn) => {
    try {
        const response = await api.post("/auth/signin", data);
        const { accessToken, refreshToken, name } = response.data;

        console.log("로그인 성공:", response.data);

        // 쿠키에 토큰 저장
        setCookie(null, "accessToken", accessToken, {
            maxAge: 60 * 60 * 24, // 1일
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        setCookie(null, "refreshToken", refreshToken, {
            maxAge: 60 * 60 * 24 * 7, // 7일
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        // localStorage에 사용자 정보 저장
        localStorage.setItem("username", data.username);
        if (name) {
            localStorage.setItem("name", name); // API 응답에서 받아온 name 저장
        }

        return response.data;
    } catch (error: any) {
        console.error("로그인 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "로그인 실패");
    }
};

export const getUserInfo = () => {
    if (typeof window === "undefined") return null; // 서버 환경에서는 실행 안 함

    const username = localStorage.getItem("username");
    const name = localStorage.getItem("name");

    return username ? { username, name: name || "이름 없음" } : null;
};

// 쿠키에서 accessToken 가져오기
export const getAccessToken = () => {
    return document.cookie.split("; ").find(row => row.startsWith("accessToken="))?.split("=")[1] || null;
};

// 쿠키에서 refreshToken 가져오기
export const getRefreshToken = () => {
    return document.cookie.split("; ").find(row => row.startsWith("refreshToken="))?.split("=")[1] || null;
};

export const refreshAccessToken = async (): Promise<string> => {
    if (refreshTokenPromise) {
        return refreshTokenPromise; // 중복 실행 방지
    }

    refreshTokenPromise = new Promise(async (resolve, reject) => {
        try {
            const cookies = parseCookies();
            const refreshToken = cookies.refreshToken;

            if (!refreshToken) {
                console.warn("🚨 리프레시 토큰 없음 → 로그인 필요");
                logout();
                return reject("리프레시 토큰이 없습니다.");
            }

            console.log("🔄 리프레시 토큰으로 새로운 액세스 토큰 요청 중...");

            const response = await api.post("/auth/refresh", { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data;

            console.log("✅ 토큰 갱신 성공!", response.data);

            // 새로운 accessToken 저장
            setCookie(null, "accessToken", accessToken, {
                maxAge: 60 * 60 * 24, // 1일
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            // 새로운 refreshToken 저장
            setCookie(null, "refreshToken", newRefreshToken, {
                maxAge: 60 * 60 * 24 * 7, // 7일
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            refreshTokenPromise = null;
            resolve(accessToken);
        } catch (error: any) {
            console.error("❌ 리프레시 토큰 요청 실패:", error.response?.data || error.message);
            logout();
            refreshTokenPromise = null;
            reject("로그인 세션이 만료되었습니다.");
        }
    });

    return refreshTokenPromise;
};

export const logout = () => {
    destroyCookie(null, "accessToken");
    destroyCookie(null, "refreshToken");
    refreshTokenPromise = null;
};
