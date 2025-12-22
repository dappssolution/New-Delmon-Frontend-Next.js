"use client";

import { useAppDispatch } from "@/src/hooks/useRedux";
import { registerUser } from "@/src/redux/auth/authThunk";
import { RootState } from "@/src/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const { loading, error, message } = useSelector(
        (state: RootState) => state.auth
    );

    const [form, setForm] = useState({
        name: "",
        email: "",
        contact_no: "",
        password: "",
        password_confirmation: "",
    });

    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(registerUser(form));
    };

    useEffect(() => {
        if (message) {
            toast.success(message);
        }
        if (error) {
            toast.error(error);
        }
    }, [message, error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 text-black">
            {/* Outer Border */}
            <div className="w-full max-w-6xl border border-[#8fccab] rounded-[28px] p-6">
                {/* Card */}
                <div className="flex min-h-[600px] rounded-[22px] shadow-xl overflow-hidden bg-white">

                    {/* Left Illustration */}
                    <div className="hidden lg:flex w-1/2 items-center justify-center bg-white">
                        <Image
                            src="/auth/register.png"
                            alt="Register Illustration"
                            width={420}
                            height={420}
                            priority
                        />
                    </div>

                    {/* Right Form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
                        <div className="w-full max-w-md">

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-semibold text-gray-900">
                                    Create an Account
                                </h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    Already Have an Account ?{" "}
                                    <Link
                                        href="/login"
                                        className="font-medium text-gray-800 hover:text-green-700"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">

                                <input
                                    name="name"
                                    placeholder="Username *"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 border border-[#8fccab] rounded-md focus:outline-none focus:border-[#114f30]"
                                    required
                                />

                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email *"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 border border-[#8fccab] rounded-md focus:outline-none focus:border-[#114f30]"
                                    required
                                />

                                <input
                                    name="contact_no"
                                    placeholder="Phone *"
                                    value={form.contact_no}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 border border-[#8fccab] rounded-md focus:outline-none focus:border-[#114f30]"
                                    required
                                />

                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password *"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 border border-[#8fccab] rounded-md focus:outline-none focus:border-[#114f30]"
                                    required
                                />

                                <input
                                    name="password_confirmation"
                                    type="password"
                                    placeholder="Confirm Password *"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 border border-[#8fccab] rounded-md focus:outline-none focus:border-[#114f30]"
                                    required
                                />

                                {/* Terms */}
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="w-4 h-4 accent-[#114f30]"
                                    />
                                    I Agree to know Terms & Policy
                                </label>



                                {/* Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !agreeTerms}
                                    className="w-full h-12 rounded-full bg-[#114f30] hover:bg-[#0d3d25] text-white font-semibold transition"
                                >
                                    {loading ? "Registering..." : "Register"}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-4 my-4">
                                    <div className="flex-1 h-px bg-gray-300" />
                                    <span className="text-sm text-gray-500">Or With</span>
                                    <div className="flex-1 h-px bg-gray-300" />
                                </div>

                                {/* Social */}
                                <div className="flex gap-4 justify-center">
                                    <button
                                        type="button"
                                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all"
                                    >
                                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                                            <path
                                                fill="#1877F2"
                                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all"
                                    >
                                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
