import api from "@/middleware/axiosInterceptor";
import { GetBoardDetail, GetBoardList, PostBoard } from "@/types";

export const createBoardPost = async ({ title, content, category, file }: PostBoard) => {
    try {
        const formData = new FormData();
        const requestData = JSON.stringify({ title, content, category });

        formData.append("request", new Blob([requestData], { type: "application/json" }));
        if (file) {
            formData.append("file", file);
        }

        const response = await api.post("/boards", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error: any) {
        console.error("❌ 게시글 작성 실패:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "게시글 작성에 실패했습니다.");
    }
};

export const fetchBoardList = async (page: number = 0, size: number = 10) => {
    try {
        const response = await api.get(`/boards?page=${page}&size=${size}&sort=id,DESC`);
        return {
            content: response.data.content as GetBoardList[], // 게시글 목록
            totalPages: response.data.totalPages, // 전체 페이지 수
            totalElements: response.data.totalElements, // 전체 게시글 개수
        };
    } catch (error) {
        console.error("게시판 목록 불러오기 실패:", error);
        throw new Error("게시글을 불러오는 중 오류가 발생했습니다.");
    }
};

export const fetchBoardDetail = async (id: number) => {
    try {
        const response = await api.get(`/boards/${id}`);
        return response.data as GetBoardDetail;
    } catch (error) {
        console.error(`❌ 게시글(${id}) 상세 조회 실패:`, error);
        throw new Error("게시글을 불러오는 중 오류가 발생했습니다.");
    }
};

export const updateBoardPost = async (id: number, title: string, content: string, category: string, file?: File | null) => {
    try {
        const formData = new FormData();
        const requestData = JSON.stringify({ title, content, category });

        formData.append("request", new Blob([requestData], { type: "application/json" }));
        if (file) {
            formData.append("file", file);
        }

        const response = await api.patch(`/boards/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.status === 200;
    } catch (error: any) {
        console.error(`❌ 게시글(${id}) 수정 실패:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "게시글 수정에 실패했습니다.");
    }
};

export const deleteBoard = async (id: number) => {
    try {
        const response = await api.delete(`/boards/${id}`);
        return response.status === 200;
    } catch (error) {
        console.error("❌ 게시글 삭제 실패:", error);
        throw new Error("게시글 삭제에 실패했습니다.");
    }
};

export const fetchBoardCategories = async () => {
    try {
        const response = await api.get(`/boards/categories`);
        return response.data; // 카테고리 데이터 반환
    } catch (error) {
        console.error("❌ 게시판 카테고리 불러오기 실패:", error);
        throw new Error("카테고리 정보를 가져올 수 없습니다.");
    }
};
