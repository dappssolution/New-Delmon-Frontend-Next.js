"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/hooks/dispatch";
import { RootState } from "@/src/redux/store";
import { loginUser } from "@/src/redux/auth/authThunk";
import { Button, FormInput } from "../common";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="text-black min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button        
        type="submit"
        loading={loading}
        loadingText="Logging in..."
        fullWidth>
            Login
        </Button>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-black underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
