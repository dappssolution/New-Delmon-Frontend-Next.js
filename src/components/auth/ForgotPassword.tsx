"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormInput from "@/src/components/common/FormInput";
import { authApi } from "@/src/service/authApi";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      toast.success("OTP sent successfully to your email!");
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {/* Outer Border */}
      <div className="w-full max-w-6xl border border-[#8fccab] rounded-[28px] p-6">
        {/* Card */}
        <div className="flex min-h-[600px] overflow-hidden bg-white">

          {/* Left Illustration */}
          <div className="hidden lg:flex w-1/2 items-center justify-center">
            <Image
              src="/auth/forgot-password.png"
              alt="Forgot Password"
              width={420}
              height={420}
              priority
            />
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">

              <h1 className="text-3xl font-semibold text-black mb-2">
                Forget Password ?
              </h1>

              <p className="text-sm text-gray-600 mb-8">
                Enter Email We’ll Send OTP
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-[#8fccab] text-black focus:ring-black"
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-full bg-[#114f30] text-white font-semibold hover:bg-[#0d3d25] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </form>

              <div className="mt-6">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-black hover:underline"
                >
                  Back to Login
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
