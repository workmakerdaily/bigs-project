import { redirect } from "next/navigation";
import { isAuthenticated } from "@/middleware/auth";

export default function Home() {
    if (!isAuthenticated()) {
        redirect("/signin"); // 로그인 안 된 경우 로그인 페이지로 리디렉션
    } else {
        redirect("/board"); // 로그인 된 경우 게시판으로 리디렉션
    }
}
