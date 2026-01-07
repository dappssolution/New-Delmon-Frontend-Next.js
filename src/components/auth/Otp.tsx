"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { authApi } from "@/src/service/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import FormInput from "@/src/components/common/FormInput";

export default function EnterOtpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get("email") || "";

    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [email, setEmail] = useState(emailFromUrl);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const code = otp.join("");

        if (code.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        if (!email) {
            toast.error("Email is required");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword({
                email,
                code,
                password,
                password_confirmation: confirmPassword
            });

            toast.success("Password reset successfully!");
            router.push("/login");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Invalid OTP or password reset failed";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
            {/* Outer Border */}
            <div className="w-full max-w-6xl border border-[#8fccab] rounded-[28px] p-6">
                {/* Card */}
                <div className="flex min-h-[600px] overflow-hidden bg-white">

                    {/* Left Illustration */}
                    <div className="hidden lg:flex w-1/2 items-center justify-center">
                        <Image
                            src="/auth/enter-otp.png"
                            alt="Reset Password"
                            width={420}
                            height={420}
                            priority
                        />
                    </div>

                    {/* Right Content */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
                        <div className="w-full max-w-md text-center">

                            <h1 className="text-3xl font-semibold text-black mb-2">
                                Reset Your Password
                            </h1>

                            <p className="text-sm text-gray-600 mb-8">
                                Enter the OTP and your new password
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Email Input */}
                                <div className="text-left">
                                    <FormInput
                                        name="email"
                                        type="email"
                                        placeholder="Email *"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 border-[#8fccab] text-black focus:ring-black"
                                        required
                                    />
                                </div>

                                {/* OTP Boxes */}
                                <div>
                                    <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                                        Enter OTP
                                    </label>
                                    <div className="flex justify-center gap-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el: any) => (inputsRef.current[index] = el)}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) =>
                                                    handleChange(e.target.value, index)
                                                }
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                className="w-12 h-12 text-center text-black text-lg border border-[#8fccab] rounded-md focus:outline-none focus:border-black"
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="text-left">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <FormInput
                                        name="password"
                                        type="password"
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 border-[#8fccab] text-black focus:ring-black"
                                        required
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="text-left">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <FormInput
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-12 border-[#8fccab] text-black focus:ring-black"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 rounded-full bg-[#114f30] text-white font-semibold hover:bg-[#0d3d25] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </button>
                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
