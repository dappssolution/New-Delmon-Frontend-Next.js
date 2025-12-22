"use client";

import { useState } from "react";
import Image from "next/image";
import FormInput from "@/src/components/common/FormInput";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        console.log("New Password:", form);
        toast.success("Password Reset Initiated");
        // call reset-password API here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            {/* Outer Border */}
            <div className="w-full max-w-6xl border border-[#8fccab] rounded-[28px] p-6">
                {/* Card */}
                <div className="flex min-h-[600px] rounded-[22px] shadow-xl overflow-hidden bg-white">

                    {/* Left Illustration */}
                    <div className="hidden lg:flex w-1/2 items-center justify-center">
                        <Image
                            src="/auth/reset-password.png"
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
                                Gotcha !
                            </h1>

                            <p className="text-sm text-gray-600 mb-8">
                                Let’s Create A New Password For Account
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* New Password */}
                                <div className="relative">
                                    <FormInput
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="h-12 border-[#8fccab] pr-12 focus:ring-black"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Show Password */}
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                        className="w-4 h-4 accent-black"
                                    />
                                    Show Password
                                </label>

                                {/* Confirm Password */}
                                <div className="relative">
                                    <FormInput
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        className="h-12 border-[#8fccab] pr-12 focus:ring-black"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-full bg-[#114f30] text-white font-semibold hover:bg-[#0d3d25] transition"
                                >
                                    Submit
                                </button>

                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
