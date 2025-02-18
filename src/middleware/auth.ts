import { parseCookies } from "nookies";

export const isAuthenticated = () => {
    const cookies = parseCookies();
    return !!cookies.accessToken; // accessToken이 존재하면 로그인된 상태
};
