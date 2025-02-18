"use client";

import useSWR from "swr";
import { fetchBoardList } from "@/services/boardService";
import Link from "next/link";
import { useState } from "react";
import { GetBoardList } from "@/types";
import { FiEdit, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function BoardList() {

    const categoryMap: { [key: string]: string } = {
        NOTICE: "공지",
        FREE: "자유",
        QNA: "Q&A",
        ETC: "기타",
    };

    const categories = ["전체", "공지", "자유", "Q&A", "기타"];

    const router = useRouter();
    const pageSize = 10;
    const [page, setPage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // ✅ SWR을 사용하여 데이터를 가져오기
    const { data, error, isValidating } = useSWR(["/boards", page], () => fetchBoardList(page, pageSize), {
        revalidateOnFocus: false,
    });


    if (error && !isValidating) {
        return <LoadingSpinner />;
    }

    const boards = data?.content ?? [];
    const totalPages = data?.totalPages ?? 1;

    return (
        <div className="max-w-screen-lg mx-auto mt-20 py-4 px-8 bg-white">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-end gap-4">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">게시판 목록</h2>
                    <div className="flex gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`mr-2 text-sm font-medium transition min-w-fit ${
                                    selectedCategory === category || (category === "전체" && !selectedCategory)
                                        ? "text-black"
                                        : "text-gray-400 hover:text-gray-800"
                                }`}
                                onClick={() => setSelectedCategory(category === "전체" ? null : category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <Link href="/board/write">
                    <button className="flex items-center gap-2 bg-[#2A39A0] text-white px-4 py-2 rounded-md hover:opacity-70 transition">
                        <FiEdit size={20} />
                        <span className="hidden lg:block">새 게시글 작성</span>
                    </button>
                </Link>
            </div>

            <hr className="mt-2 mb-4 md:mb-10 border-t-2 border-gray-300" />

            {isValidating ? (
                <LoadingSpinner />
            ) : (
                <ul className="space-y-2">
                    {boards.length > 0 ? (
                        boards.map((board: GetBoardList) => (
                            <li
                                key={board.id}
                                className="p-4 border-b relative cursor-pointer group transition-all hover:bg-gray-100"
                                onClick={() => router.push(`/board/${board.id}`)}
                            >
                                <Link href={`/board/${board.id}`} className="text-lg font-semibold">
                                    {board.title}
                                </Link>
                                <p className="text-sm text-gray-500">
                                    {categoryMap[board.category] || "기타"} | {new Date(board.createdAt).toLocaleDateString()}
                                </p>
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-400 transition-all duration-300 group-hover:w-full" />
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 bg-gray-100 p-5 rounded-lg">게시글이 없습니다.</p>
                    )}
                </ul>
            )}

            {/* 페이지네이션 */}
            <div className="mt-6 flex justify-between items-center">
                <button
                    className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full disabled:opacity-50 hover:bg-gray-400 transition"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                >
                    <FiChevronLeft size={20} />
                </button>

                <span className="text-lg font-semibold text-gray-700">{`${page + 1} / ${totalPages}`}</span>

                <button
                    className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full disabled:opacity-50 hover:bg-gray-400 transition"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page + 1 >= totalPages}
                >
                    <FiChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
