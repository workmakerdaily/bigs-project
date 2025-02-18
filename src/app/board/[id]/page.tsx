"use client";

import useSWR from "swr";
import { useRouter, useParams } from "next/navigation";
import { deleteBoard, fetchBoardDetail } from "@/services/boardService";
import { FiArrowLeft, FiEdit, FiTrash } from "react-icons/fi";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function BoardDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    // SWR을 사용하여 게시글 상세 조회 (자동 캐싱 & 리프레시)
    const { data: board, error, isValidating, mutate } = useSWR(id ? `/boards/${id}` : null, () => fetchBoardDetail(Number(id)), {
        revalidateOnFocus: false, // 페이지 포커싱 시 다시 요청 방지
    });

    const categoryMap: { [key: string]: string } = {
        NOTICE: "공지",
        FREE: "자유",
        QNA: "Q&A",
        ETC: "기타",
    };

    // 게시글 삭제 기능
    const handleDelete = async () => {
        if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

        try {
            const success = await deleteBoard(Number(id));
            if (success) {
                alert("게시글이 삭제되었습니다.");
                router.push("/board"); // 삭제 후 목록으로 이동
            } else {
                alert("게시글 삭제에 실패했습니다.");
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    if (isValidating) return <LoadingSpinner />

    if (error) return <div className="h-screen flex items-center justify-center text-red-500">데이터를 불러올 수 없습니다.</div>;

    if (!board) return <div className="h-screen flex items-center justify-center text-gray-500">게시글을 찾을 수 없습니다.</div>;

    return (
        <div className="max-w-screen-lg mx-auto mt-20 py-4 px-8 bg-white">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">게시글 상세보기</h2>

                {/* 목록으로 돌아가기 아이콘 버튼 */}
                <button
                    onClick={() => router.push("/board")}
                    className="text-gray-500 hover:text-gray-700 transition"
                >
                    <FiArrowLeft size={30} />
                </button>
            </div>

            <hr className="mt-2 mb-4 md:mb-10 border-t-2 border-gray-300" />

            <div className="flex items-center justify-between mb-2 md:mb-4">
                <h2 className="text-xl md:text-2xl font-bold">{board.title}</h2>

                {/* 수정/삭제 버튼 그룹 */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push(`/board/${id}/update`)}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <FiEdit size={24} />
                    </button>

                    <button
                        onClick={handleDelete}
                        className="text-gray-500 hover:text-red-500 transition"
                    >
                        <FiTrash size={24} />
                    </button>
                </div>
            </div>

            <p className="text-gray-500 text-xs md:text-sm mb-4">
                {categoryMap[board.boardCategory] || "기타"} | {new Date(board.createdAt).toLocaleDateString()}
            </p>

            {board.imageUrl && (
                <div className="mb-4">
                    <Image
                        src={`https://front-mission.bigs.or.kr${board.imageUrl}`}
                        alt="게시글 이미지"
                        width={400}
                        height={400}
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <p className="text-md md:text-lg">{board.content}</p>

        </div>
    );
}
