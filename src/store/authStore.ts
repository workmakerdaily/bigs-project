import { makeAutoObservable, autorun } from "mobx";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { logout } from "@/services/authService";

class AuthStore {
    isAuthenticated = false;

    constructor() {
        makeAutoObservable(this);
        this.checkAuthStatus(); // 앱 실행 시 로그인 상태 확인

        // 🔄 상태 변경 감지 로그 추가
        autorun(() => {
            console.log(`🔄 MobX autorun 실행됨! isAuthenticated: ${this.isAuthenticated}`);
        });
    }

    checkAuthStatus() {
        const cookies = parseCookies();
        this.isAuthenticated = !!cookies.accessToken;
        console.log(`🔍 초기 로그인 상태: ${this.isAuthenticated}`);
    }

    logIn(accessToken: string, refreshToken: string) {
        console.log("🔐 로그인 성공 → 토큰 저장");

        // ✅ 로그인 성공 시 쿠키 저장
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

        this.isAuthenticated = true;
        console.log(`✅ isAuthenticated 변경됨: ${this.isAuthenticated}`);
    }

    logOut() {
        console.log("🚪 로그아웃 실행됨 → 토큰 삭제");

        logout(); // 서버 요청 로그아웃 실행
        destroyCookie(null, "accessToken");
        destroyCookie(null, "refreshToken");

        this.isAuthenticated = false;
        console.log(`🚨 isAuthenticated 변경됨: ${this.isAuthenticated}`);
    }
}

const authStore = new AuthStore();
export default authStore;
