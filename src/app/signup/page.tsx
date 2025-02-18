"use client";

import { useState } from "react";
import Image from "next/image";
import { signUpRequest } from "@/services/authService";
import { validateEmail, validatePassword } from "@/utils/validation";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function SignUp() {

    const router = useRouter();
    // state: 입력값 //
    const [form, setForm] = useState({
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    // state: 유효성 검사 활성화 여부 //
    const [touched, setTouched] = useState({
        name: false,
        username: false,
        password: false,
        confirmPassword: false,
    });

    // variable: 유효성 검사 //
    const isValidUsername = validateEmail(form.username);
    const isValidPassword = validatePassword(form.password);
    const isPasswordMatched = form.password === form.confirmPassword && form.password.length > 0;
    const isNameEntered = form.name.trim() !== "";
    const isValid = isValidUsername && isValidPassword && isPasswordMatched && isNameEntered;

    // event handler: 입력값 변경 //
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // event handler: 회원가입 //
    const handleSignup = async () => {
        if (!isValid) return;

        try {
            const success = await signUpRequest(form);
            if (success) {
                alert("회원가입이 완료되었습니다!");
                localStorage.setItem("name", form.name);
                setForm({ name: "", username: "", password: "", confirmPassword: "" });
            } else {
                setError("회원가입 실패: 이메일 중복 또는 서버 오류.");
            }
        } catch (error) {
            setError("회원가입 중 예상치 못한 오류가 발생했습니다.");
        }
        router.push("/signin");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="bg-white text-black p-8 w-96">

                <div className="flex items-center justify-center gap-2 mb-6">
                    <Image src="/images/logo.png" alt="BIGS Logo" width={32} height={32} />
                    <h2 className="text-3xl font-bold tracking-wide text-[#2D6CDF]">회원가입</h2>
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <div className="space-y-4">
                    <FormInput
                        label="이름"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                        errorMessage={touched.name && !isNameEntered ? "이름을 입력하세요." : ""}
                    />

                    <FormInput
                        label="이메일"
                        type="email"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                        errorMessage={touched.username && !isValidUsername ? "올바른 이메일 형식을 입력하세요." : ""}
                    />

                    <FormInput
                        label="비밀번호"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                        errorMessage={touched.password && !isValidPassword ? "비밀번호는 8자 이상, 영문+숫자+특수문자 포함." : ""}
                    />

                    <FormInput
                        label="비밀번호 확인"
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                        errorMessage={touched.confirmPassword && !isPasswordMatched ? "비밀번호가 일치하지 않습니다." : ""}
                    />

                    <Button text="회원가입" onClick={handleSignup} disabled={!isValid} />
                </div>

                <div className="mt-5 text-center text-sm text-gray-600">
                    이미 계정이 있으신가요?{" "}
                    <a href="/signin" className="text-[#2D6CDF] cursor-pointer hover:underline">로그인</a>
                </div>
            </div>
        </div>
    );
}
