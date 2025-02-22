"use client";

import { useState, useEffect } from "react";
import { getUserInfo, logout } from "@/services/authService";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

// component: 네비게이션 바 컴포넌트 //
export default function Navbar() {

    // variable: 라우터 및 현재 경로 //
    const router = useRouter();
    const pathname = usePathname();

    // state: 사용자 정보 //
    const [user, setUser] = useState<{ username: string; name: string } | null>(null);

    // state: 화면 크기 상태 //
    const [isMobile, setIsMobile] = useState(false);

    // state: 특정 경로에서 Navbar 숨김 여부 //
    const [shouldShowNavbar, setShouldShowNavbar] = useState(true);

    // effect: 로그인 상태 확인 및 화면 크기 감지 //
    useEffect(() => {
        // 로그인 및 회원가입 페이지에서는 Navbar 숨기기
        const hideNavbarRoutes = ["/", "/signup"];
        setShouldShowNavbar(!hideNavbarRoutes.includes(pathname));

        // 사용자 정보 가져오기
        if (typeof window !== "undefined") {
            const userInfo = getUserInfo();
            setUser(userInfo);
        }

        // 화면 크기 감지지
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [pathname]);

    // Navbar를 렌더링하지 않아야 하는 경우, return 처리
    if (!shouldShowNavbar) return null;

    // event handler: 로그아웃 //
    const handleLogout = () => {
        logout();
        router.push("/");
    };

    // render: 네비게이션 바 컴포넌트 렌더링링 //
    return (
        <>
            {/* 모바일 (상단바) */}
            {isMobile ? (
                <div className="max-w-screen-lg py-4 px-8 w-full bg-[#2A39A0] text-white flex flex-col fixed top-0 left-0 right-0 z-50">
                    {/* 로고 & 로그아웃 버튼 */}
                    <div className="flex items-center justify-between">
                        <div className="text-2xl tracking-widest font-bold">BIGS</div>
                        {/* 사용자 정보 */}
                        {user ? (
                            <div className="flex items-center justify-center gap-2 p-3 mr-24 text-center bg-[#1E255E] rounded-lg">
                                <p className="text-sm">{user.name}</p>
                                <p className="text-xs text-gray-200">{user.username}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-300 text-center">로그인 필요</p>
                        )}
                        <button onClick={handleLogout} className="text-white hover:text-gray-300">
                            <FiLogOut size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                // 데스크탑 (Sidebar)
                <div className="w-64 h-screen bg-[#2A39A0] text-white flex flex-col p-6 fixed top-0 left-0">
                    {/* 상단 로고 & 로그아웃 버튼 */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-2xl tracking-widest font-bold">BIGS</div>
                        <button onClick={handleLogout} className="text-white hover:text-gray-300">
                            <FiLogOut size={20} />
                        </button>
                    </div>

                    {/* 사용자 정보 */}
                    {user ? (
                        <div className="mb-6 p-4 bg-[#1E255E] rounded-lg">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-xs text-gray-200">{user.username}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-300">로그인 필요</p>
                    )}

                    {/* 메뉴 리스트 */}
                    <nav className="space-y-2">
                        <Link 
                            href="/board" 
                            className={`flex items-center p-2 rounded-md transition ${pathname === "/board" ? "bg-[#1E255E] bg-opacity-70" : "hover:bg-[#1E255E] hover:bg-opacity-60"}`}
                        >
                            게시판
                        </Link>
                        <Link 
                            href="/board/write" 
                            className={`flex items-center p-2 rounded-md transition ${pathname === "/board/write" ? "bg-[#1E255E] bg-opacity-70" : "hover:bg-[#1E255E] hover:bg-opacity-60"}`}
                        >
                            글 작성
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
}
