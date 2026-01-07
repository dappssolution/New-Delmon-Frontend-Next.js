"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    error?: string;
    showToggle?: boolean;
}

export default function FormInput({
    name,
    label,
    error,
    className = "",
    type,
    showToggle = true,
    ...props
}: FormInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
                        } ${className} ${isPassword && showToggle ? 'pr-10' : ''}`}
                    {...props}
                />
                {isPassword && showToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
}
