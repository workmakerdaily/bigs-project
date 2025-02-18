"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchBoardCategories, fetchBoardDetail, updateBoardPost } from "@/services/boardService";
import Button from "@/components/Button";
import useSWR from "swr";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditBoardPage() {

    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "NOTICE",
    });
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const { data: categories, error: categoryError } = useSWR("/boards/categories", fetchBoardCategories);

    useEffect(() => {
        const loadBoardDetail = async () => {
            try {
                const data = await fetchBoardDetail(Number(id));
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

    // event handler: 입력값 변경
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // event handler: 파일 변경
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setImageUrl(null);
        }
    };

    // event handler: 게시글 수정 요청
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
            router.push(`/board/${id}`); // 수정 후 상세 페이지로 이동
        } catch (error: any) {
            console.error("게시글 수정 중 오류 발생:", error.message);
            setError(error.message);
        }
    };

    if (loading) return <LoadingSpinner />

    if (error)
        return (
            <div className="h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );

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