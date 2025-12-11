"use client";

import { useAppDispatch } from "@/src/hooks/dispatch";
import { registerUser } from "@/src/redux/auth/authThunk";
import { RootState } from "@/src/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import FormInput from "../common/FormInput";
import Button from "../common/Button";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser(form));
        setForm({
            name: "",
            email: "",
            contact_no: "",
            password: "",
            password_confirmation: "",
        })
    };

    return (
        <div className="text-black min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center">Register</h2>

                <FormInput
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={form.name}
                    required
                />

                <FormInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.email}
                    required
                />

                <FormInput
                    name="contact_no"
                    placeholder="Phone"
                    onChange={handleChange}
                    value={form.contact_no}
                    required
                />

                <FormInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={form.password}
                    required
                />

                <FormInput
                    name="password_confirmation"
                    type="password"
                    placeholder="Password Confirmation"
                    onChange={handleChange}
                    value={form.password_confirmation}
                    required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}

                <Button
                    type="submit"
                    loading={loading}
                    loadingText="Registering..."
                    fullWidth
                >
                    Register
                </Button>
                     <p className="text-sm text-center text-gray-500">
          have an account?{" "}
          <a href="/login" className="text-black underline">
            Login
          </a>
        </p>
            </form>
        </div>
    );
}
