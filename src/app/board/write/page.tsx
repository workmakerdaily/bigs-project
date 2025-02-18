"use client";

import { useState } from "react";
import useSWR from "swr";
import { createBoardPost, fetchBoardCategories } from "@/services/boardService";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

// component: 게시글 작성 페이지 //
export default function WritePage() {

    // variable: 라우터 객체 //
    const router = useRouter();

    // state: 게시글 작성 폼 //
    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "NOTICE",
    });

    // state: 파일 업로드 //
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    // state: 에러 메시지 //
    const [error, setError] = useState("");

    // state: 카테고리 데이터 가져오기 //
    const { data: categories, error: categoryError } = useSWR("/boards/categories", fetchBoardCategories);

    // event handler: 입력값 변경 //
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // event handler: 파일 선택 //
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(e.target.files[0]);
            setFileName(selectedFile.name);
        }
    };

    // event handler: 게시글 작성 //
    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            setError("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            await createBoardPost({ ...form, file, fileName });
            alert("게시글이 작성되었습니다!");
            router.push("/board"); // 게시판 목록으로 이동
        } catch (error: any) {
            setError(error.message);
        }
    };

    // render: 게시글 작성 페이지 렌더링 //
    return (
        <div className="max-w-screen-lg mx-auto mt-20 py-4 px-8 bg-white">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">게시글 작성</h2>

            <hr className="mt-2 mb-4 md:mb-10 border-t-2 border-gray-300" />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {categoryError && <p className="text-red-500 text-sm mb-4">카테고리를 불러올 수 없습니다.</p>}

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

                {/* 카테고리 선택 */}
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

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                />

                <Button text="작성 완료" onClick={handleSubmit} />
            </div>
        </div>
    );
}
