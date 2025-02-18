import axios from "axios";

// variable: API 기본 URL //
const API_BASE_URL = "https://front-mission.bigs.or.kr";

// variable: Axios 인스턴스 생성 //
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
