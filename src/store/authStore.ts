import { makeAutoObservable, autorun } from "mobx";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { logout } from "@/services/authService";

// class: 인증 상태 관리 (MobX Store) //
class AuthStore {
    isAuthenticated = false;

    constructor() {
        makeAutoObservable(this);
        this.checkAuthStatus(); // 앱 실행 시 로그인 상태 확인

        // MobX 상태 변경 감지 (디버깅용용)
        autorun(() => {
            console.log(`MobX autorun 실행됨! isAuthenticated: ${this.isAuthenticated}`);
        });
    }

    // function: 현재 로그인 상태 확인 //
    checkAuthStatus() {
        const cookies = parseCookies();
        this.isAuthenticated = !!cookies.accessToken;
        console.log(`🔍 초기 로그인 상태: ${this.isAuthenticated}`);
    }

    // function: 로그인 (토큰 저장) //
    logIn(accessToken: string, refreshToken: string) {
        console.log("로그인 성공 → 토큰 저장");

        // accessToken 저장 
        setCookie(null, "accessToken", accessToken, {
            maxAge: 60 * 60 * 24, // 1일
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        // refreshToken 저장 
        setCookie(null, "refreshToken", refreshToken, {
            maxAge: 60 * 60 * 24 * 7, // 7일
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        this.isAuthenticated = true;
        console.log(`isAuthenticated 변경됨: ${this.isAuthenticated}`);
    }

    // function: 로그아웃 (토큰 삭제) //
    logOut() {
        console.log("로그아웃 실행됨 → 토큰 삭제");

        logout(); // 서버 요청 로그아웃 실행
        destroyCookie(null, "accessToken");
        destroyCookie(null, "refreshToken");

        this.isAuthenticated = false;
        console.log(`🚨 isAuthenticated 변경됨: ${this.isAuthenticated}`);
    }
}

const authStore = new AuthStore();
export default authStore;
