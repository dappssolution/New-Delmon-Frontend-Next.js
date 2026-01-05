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
        username: "",
        email: "",
        contact_no: "",
        password: "",
        password_confirmation: "",
        vendor_join: "",
        role: "user",
    });

    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loginUrl, setLoginUrl] = useState("/login");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect") || sessionStorage.getItem("redirectAfterLogin");
        const role = searchParams.get("role");

        if (redirect) {
            setLoginUrl(`/login?redirect=${encodeURIComponent(redirect)}`);
        }

        if (role === "vendor") {
            setForm(prev => ({ ...prev, role: "vendor" }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

const payload: any = {
  email: form.email,
  contact_no: form.contact_no,
  password: form.password,
  password_confirmation: form.password_confirmation,
  role: form.role,
};

if (form.role === "user") {
  payload.username = form.username;
}

if (form.role === "vendor") {
  payload.name = form.name;
  payload.username = form.username;
  payload.vendor_join = form.vendor_join;
}


  const result = await dispatch(registerUser(payload));

        if (registerUser.fulfilled.match(result)) {
            toast.success("Registration successful! Please check your email to verify your account.");

            const searchParams = new URLSearchParams(window.location.search);
            const redirect = searchParams.get("redirect") || sessionStorage.getItem("redirectAfterLogin");
            let verifyUrl = "/verify-email/0/0";
            if (redirect) {
                verifyUrl += `?redirect=${encodeURIComponent(redirect)}`;
            }

            setTimeout(() => {
                window.location.href = verifyUrl;
            }, 2000);
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 text-black">
            {/* Outer Border */}
            <div className="w-full max-w-6xl border border-[#8fccab] rounded-[28px] p-6 lg:p-12">
                {/* Card */}
                <div className="flex flex-col lg:flex-row min-h-[600px] overflow-hidden bg-white">

                    {/* Left Side (Form) */}
                    <div className={`w-full ${form.role === "vendor" ? "lg:w-7/12" : "lg:w-1/2"} flex flex-col items-center justify-center px-4 lg:px-8`}>
                        <div className="w-full max-w-md">

                            {/* Header */}
<div className="text-center mb-8">
  <h1 className="text-3xl font-bold text-gray-900">
    {form.role === "vendor" ? "Create a Vendor Account" : "Create an Account"}
  </h1>
</div>


                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {form.role === "vendor" && (
                                <input
                                    name="name"
                                    placeholder="Shop Name*"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 border border-[#8fccab] rounded-md focus:outline-none focus:border-[#114f30]"
                                    required
                                />
                                )}
                                <input
                                    name="username"
                                    placeholder="Username*"
                                    value={form.username}
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

                                {form.role === "vendor" && (
                                    <select
                                        name="vendor_join"
                                        value={form.vendor_join}
                                        onChange={handleChange}
                                        className="w-full h-12 px-4 border border-[#8fccab] rounded-md focus:outline-none focus:border-[#114f30] bg-white text-gray-700"
                                        required
                                    >
                                        <option value="" disabled>Select joining year</option>
                                        {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                )}

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

                                <div className="flex justify-center">
  <button
    type="submit"
    disabled={loading || !agreeTerms}
    className="w-full sm:w-auto px-10 h-12 rounded-full bg-[#035b31] hover:bg-[#0d3d25] text-white font-semibold transition disabled:opacity-60"
  >
    {loading
      ? "Registering..."
      : form.role === "vendor"
        ? "Submit & Register"
        : "Register"}
  </button>
</div>


                                <div className="mt-3 text-center text-sm text-gray-600">
  Already have an account?{" "}
  <Link
    href={form.role === "vendor" ? "/login?role=vendor" : "/login"}
    className="font-medium text-[#114f30] hover:underline"
  >
    Login
  </Link>
</div>

                                {form.role !== "vendor" && (
                                    <>
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
                                    </>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Right Side (Illustration/Requirements) */}
                    <div className={`w-full ${form.role === "vendor" ? "lg:w-5/12 pt-20" : "lg:w-1/2"} flex flex-col items-center justify-center p-8`}>
                        {form.role === "vendor" ? (
                            <div className="w-full max-w-sm space-y-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg">Password Must :</h3>
                                    <p className="text-gray-600 text-sm">Between 8 and 64 characters</p>
                                    <p className="text-gray-600 text-sm">Include at least 2 of the following :</p>
                                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-4">
                                        <li>A uppercase character</li>
                                        <li>A lowercase character</li>
                                        <li>A number character</li>
                                        <li>A special character</li>
                                    </ul>
                                </div>

                                <div className="pt-12">
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        <span className="font-bold">Note :</span> Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes describe in our privacy policy
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Image
                                src="/auth/register.png"
                                alt="Register Illustration"
                                width={420}
                                height={420}
                                priority
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
