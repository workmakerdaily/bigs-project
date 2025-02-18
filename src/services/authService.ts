import { SignIn, SignUp } from "@/types";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import api from "./api";

export const signUpRequest = async (data: SignUp) => {
    try {
        console.log("회원가입 요청 데이터:", JSON.stringify(data));

        const response = await api.post("/auth/signup", data);
        console.log("회원가입 응답:", response.data);

        return response.status === 200;
    } catch (error) {
        throw new Error("회원가입에 실패했습니다.");
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

export const refreshAccessToken = async () => {
    try {
        const cookies = parseCookies();
        const refreshToken = cookies.refreshToken;

        const response = await api.post("/auth/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

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

        return accessToken;
    } catch (error: any) {
        console.error("리프레시 토큰 요청 실패:", error.response?.data || error.message);
        logout();
        throw new Error("로그인 세션이 만료되었습니다.");
    }
};

export const logout = () => {
    destroyCookie(null, "accessToken");
    destroyCookie(null, "refreshToken");
};
