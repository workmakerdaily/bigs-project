"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchBoardCategories, fetchBoardDetail, updateBoardPost } from "@/services/boardService";
import Button from "@/components/Button";
import useSWR from "swr";
import LoadingSpinner from "@/components/LoadingSpinner";

// component: 업데이트 페이지 //
export default function UpdateBoardPage() {

    // variable: 게시글 ID 및 라우터 객체 //
    const { id } = useParams();
    const router = useRouter();

    // state: 게시글 수정 폼 상태 //
    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "NOTICE",
    });

    // state: 파일 업로드 및 이미지 상태 //
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // state: 에러 메시지 및 로딩 상태 //
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // effect: 게시판 카테고리 데이터 가져오기 //
    const { data: categories, error: categoryError } = useSWR("/boards/categories", fetchBoardCategories);

    // effect: 게시글 상세 정보 불러오기 //
    useEffect(() => {
        const loadBoardDetail = async () => {
            try {
                const data = await fetchBoardDetail(Number(id));

                // state: 게시글 상세 정보 업데이트 //
                setForm({
                    title: data.title,
                    content: data.content,
                    category: data.boardCategory,
                });

                if (data.imageUrl) {
                    setImageUrl(data.imageUrl);
                }

                setLoading(false);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadBoardDetail();
        }
    }, [id]);

    // event handler: 입력값 변경 //
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // event handler: 파일 변경 //
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setImageUrl(null);
        }
    };

    // event handler: 게시글 수정 요청 //
    const handleUpdate = async () => {
        if (!form.title || !form.content) {
            setError("제목과 내용을 입력하세요.");
            return;
        }

        try {
            await updateBoardPost({
                id: Number(id),
                title: form.title,
                content: form.content,
                category: form.category,
                file: file,
            });
            alert("게시글이 수정되었습니다.");
            router.push(`/board/${id}`);
        } catch (error: any) {
            console.error("게시글 수정 중 오류 발생:", error.message);
            setError(error.message);
        }
    };

    // render: 로딩 화면 //
    if (loading) return <LoadingSpinner />

    // render: 에러 메시지 //
    if (error)
        return (
            <div className="h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );

    // render: 업데이트 페이지 렌더링 //
    return (
        <div className="max-w-screen-lg mx-auto mt-20 py-4 px-8 bg-white">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">게시글 수정</h2>

            <hr className="mt-2 mb-4 md:mb-10 border-t-2 border-gray-300" />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="제목을 입력하세요"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <textarea
                    name="content"
                    placeholder="내용을 입력하세요"
                    value={form.content}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded h-32"
                ></textarea>

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    {categories
                        ? Object.entries(categories).map(([key, value]) => (
                            <option key={key} value={key}>{value as string}</option>
                        ))
                        : <option>카테고리 불러오는 중...</option>
                    }
                </select>

                {imageUrl && (
                    <div>{imageUrl}</div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                />

                <Button text="수정 완료" onClick={handleUpdate} />
            </div>
        </div>
    );
}