"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    console.log("OTP:", code);
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
              src="/auth/verify-email.jpg"
              alt="Verify Email"
              width={420}
              height={420}
              priority
            />
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">

              <h1 className="text-3xl font-semibold text-black mb-2">
                Verify Your Email
              </h1>

              <p className="text-sm text-gray-600 mb-6">
                A 6-digit code has been send to your email <br />
                <span className="font-medium text-black">
                  farah632gmail.com
                </span>
              </p>

              {/* OTP Inputs */}
              <form onSubmit={handleSubmit}>
                <div className="flex justify-center gap-3 mb-6">
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
                      className="w-12 h-12 text-center text-lg border border-[#8fccab] rounded-md focus:outline-none focus:border-black"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-500 mb-2">
                  The OTP will be expired in <span className="font-medium">5:00</span>
                </p>

                <p className="text-sm text-gray-600 mb-6">
                  Doesn’t receive code ?{" "}
                  <button
                    type="button"
                    className="font-medium text-black hover:underline"
                  >
                    Resend
                  </button>
                </p>

                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[#114f30] text-white font-semibold hover:bg-[#0d3d25] transition"
                >
                  Continue
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
