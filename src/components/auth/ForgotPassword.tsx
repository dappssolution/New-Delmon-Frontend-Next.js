"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FormInput from "@/src/components/common/FormInput";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Send OTP to:", email);
    // call forgot-password API here
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
                  className="h-12 border-[#8fccab] focus:ring-black"
                  required
                />

                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[#114f30] text-white font-semibold hover:bg-[#0d3d25] transition"
                >
                  Send
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
