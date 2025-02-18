"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAccessToken, signInRequest } from "@/services/authService";
import { validateEmail } from "@/utils/validation";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

export default function SignIn() {
    const router = useRouter();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [touched, setTouched] = useState({
        username: false,
        password: false,
    });
    const [error, setError] = useState("");

    // ✅ 유효성 검사는 입력 필드가 `touched` 상태가 된 후 실행
    const isValidUsername = touched.username && validateEmail(form.username);
    const isPasswordEntered = touched.password && form.password.length > 0;
    const isValid = validateEmail(form.username) && form.password.length > 0;

    // event handler: 입력값 변경
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // event handler: 입력 필드가 `blur`될 때 `touched` 활성화
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    };

    // event handler: 로그인
    const handleSignin = async () => {
        if (!isValid) return;

        try {
            await signInRequest(form);
            alert("로그인되었습니다.");
            router.push("/board");
        } catch (error: any) {
            setError(error.message);
        }
    };


    useEffect(() => {
        if (getAccessToken()) {
            router.push("/board");
        }
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="bg-white text-black p-8 w-96">

                <div className="flex items-center justify-center gap-2 mb-6">
                    <Image src="/images/logo.png" alt="BIGS Logo" width={32} height={32} className="h-8 w-8" />
                    <h2 className="text-3xl font-bold tracking-wide text-[#2D6CDF]">로그인</h2>
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <div className="space-y-4">
                    <FormInput
                        label="이메일"
                        type="email"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        onBlur={handleBlur} // ✅ 포커스가 빠져나갈 때 `touched` 활성화
                        errorMessage={touched.username && !validateEmail(form.username) ? "올바른 이메일 형식을 입력하세요." : ""}
                    />

                    <FormInput
                        label="비밀번호"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur} // ✅ 포커스가 빠져나갈 때 `touched` 활성화
                        errorMessage={touched.password && form.password.length === 0 ? "비밀번호를 입력하세요." : ""}
                    />

                    <Button text="로그인" onClick={handleSignin} disabled={!isValid} />
                </div>

                <div className="mt-5 text-center text-sm text-gray-600">
                    계정이 없으신가요?{" "}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        회원가입
                    </a>
                </div>
            </div>
        </div>
    );
}
