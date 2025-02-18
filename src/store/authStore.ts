import { makeAutoObservable } from "mobx";
import { parseCookies } from "nookies";
import { logout } from "@/services/authService";

class AuthStore {
    isAuthenticated = false;

    constructor() {
        makeAutoObservable(this);
        this.checkAuthStatus(); // 앱 실행 시 로그인 상태 확인
    }

    checkAuthStatus() {
        const cookies = parseCookies();
        this.isAuthenticated = !!cookies.accessToken;
    }

    logOut() {
        logout();
        this.isAuthenticated = false;
    }
}

const authStore = new AuthStore();
export default authStore;
