"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useAppDispatch } from "@/src/hooks/useRedux";
import { RootState } from "@/src/redux/store";
import { loginUser } from "@/src/redux/auth/authThunk";
import FormInput from "@/src/components/common/FormInput";
import { authApi } from "@/src/service/authApi";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const isVendor = role === "vendor" || role?.startsWith("vendor");

  const { loading, error, token, user, verified } = useSelector(
    (state: RootState) => state.auth
  );

  const { profile } = useSelector(
    (state: RootState) => state.user
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await authApi.getGoogleAuthUrl();
      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.error("Failed to get Google login URL");
      }
    } catch (err) {
      toast.error("An error occurred while connecting to Google");
    }
  };

  useEffect(() => {
    if (token && user) {
      if (verified) {
        toast.success("Login Successful!");
      } else {
        toast.success("Login Successful! Please verify your email.");
      }

      const redirectPath = searchParams.get("redirect");
      const storedRedirect = sessionStorage.getItem("redirectAfterLogin");

      let destination = redirectPath || storedRedirect || "/";

      if (user.role === "vendor") {
        if (!destination.startsWith("/vendor")) {
          destination = "/vendor";
        }
      }

      sessionStorage.removeItem("redirectAfterLogin");
      router.push(destination);
    }
  }, [token, user, verified, profile, router, searchParams]);

  const [registerUrl, setRegisterUrl] = useState("/register");

  useEffect(() => {
    const redirect = searchParams.get("redirect") || sessionStorage.getItem("redirectAfterLogin");
    if (redirect) {
      setRegisterUrl(`/register?redirect=${encodeURIComponent(redirect)}`);
    } else {
      if (isVendor) {
        setRegisterUrl("/register?role=vendor");
      } else {
        setRegisterUrl("/register");
      }
    }
  }, [searchParams, isVendor]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {/* Outer Border */}
      <div className="w-full max-w-6xl border border-[#8fccab] rounded-[28px] p-6">
        {/* Card */}
        <div className="flex min-h-[600px] overflow-hidden bg-white">

          {/* Left Section */}
          <div className="hidden lg:flex w-1/2 flex-col items-center justify-center text-black">
            <Image
              src="/delmon-logo-only.png"
              alt="Delmon"
              width={170}
              height={60}
              priority
            />

            <h2 className="text-3xl font-semibold mt-8 mb-4">
              {isVendor ? "Vendor Portal" : "Hey ! Welcome"}
            </h2>

            <p className="text-center text-sm leading-relaxed max-w-xs">
              {isVendor
                ? "Manage your products, orders, and sales in one place. Grow your business with Delmon."
                : (
                  <>
                    We’re glad to see you again. <br />
                    Log in to explore products, manage your cart, and enjoy a better shopping experience.
                  </>
                )
              }
            </p>

            <div className="mt-8">
              <Image
                src={isVendor ? "/auth/vendor-login.jpg" : "/auth/login.jpg"}
                alt={isVendor ? "Vendor Login" : "Login Illustration"}
                width={360}
                height={360}
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
            <div className="w-full max-w-md">

              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-semibold text-black">
                  {isVendor ? "Vendor Login" : "Login"}
                </h1>
              </div>



              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-black">

                <FormInput
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 border-[#8fccab] focus:ring-black"
                  required
                />

                <FormInput
                  name="password"
                  type="password"
                  placeholder="Password *"
                  value={form.password}
                  onChange={handleChange}
                  className="h-12 border-[#8fccab] focus:ring-black"
                  required
                />

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm text-black">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-black"
                    />
                    Remember Me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="hover:underline"
                  >
                    Forget Password ?
                  </Link>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#114f30] text-white font-semibold hover:bg-[#0d3d25] transition disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {/* Bottom Register CTA */}
                <div className="mt-3 text-center text-sm text-gray-600">
                  {isVendor ? "New to Delmon?" : "Don’t have an account?"}{" "}
                  <Link
                    href={isVendor ? "/register?role=vendor" : "/register"}
                    className="font-medium text-[#114f30] hover:underline"
                  >
                    {isVendor ? "Become a Vendor" : "Create one"}
                  </Link>
                </div>

                {/* Divider and Social Login (Only for User) */}
                {!isVendor && (
                  <>
                    <div className="flex items-center gap-4 my-4">
                      <div className="flex-1 h-px bg-gray-300" />
                      <span className="text-sm text-black">Or With</span>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    <div className="flex justify-center gap-6 text-white">

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-12 h-12 flex items-center justify-center rounded-full border hover:shadow"
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

        </div>
      </div>
    </div>
  );
}
