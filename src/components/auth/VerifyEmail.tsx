"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { resendVerificationEmail } from "@/src/redux/auth/authThunk";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { toast } from "sonner";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  const [resendLoading, setResendLoading] = useState(false);
  const [loginUrl, setLoginUrl] = useState("/login");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect") || sessionStorage.getItem("redirectAfterLogin");
    if (redirect) {
      setLoginUrl(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, []);

  const handleResendEmail = async () => {
    if (!token) {
      toast.error("No authentication token found. Please register again.");
      router.push("/register");
      return;
    }

    setResendLoading(true);
    try {
      await dispatch(resendVerificationEmail(token)).unwrap();
      toast.success("Verification email sent successfully! Please check your inbox.");
    } catch (err: any) {
      toast.error(err || "Failed to resend verification email");
    } finally {
      setResendLoading(false);
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

              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#114f30]/10 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-[#114f30]" />
                </div>
              </div>

              <h1 className="text-3xl font-semibold text-black mb-3">
                Check Your Email
              </h1>

              <p className="text-base text-gray-600 mb-6">
                We've sent a verification link to your email address.
                <br />
                Please click the link in the email to verify your account.
              </p>

              <div className="bg-[#114f30]/5 border border-[#114f30]/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> The verification link will expire in 24 hours.
                  If you don't see the email, check your spam folder.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  className="w-full h-12 rounded-full bg-[#114f30] text-white font-semibold hover:bg-[#0d3d25] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Resend Verification Email
                    </>
                  )}
                </button>

                <button
                  onClick={() => router.push(loginUrl)}
                  className="w-full h-12 rounded-full border-2 border-[#114f30] text-[#114f30] font-semibold hover:bg-[#114f30] hover:text-white transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Login
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Already verified?{" "}
                <button
                  onClick={() => router.push(loginUrl)}
                  className="font-medium text-[#114f30] hover:underline"
                >
                  Login here
                </button>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
