import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    loading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = "primary",
    loading = false,
    loadingText = "Loading...",
    fullWidth = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "py-2 px-4 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-black text-white hover:bg-gray-800",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        outline: "bg-white border border-gray-300 text-gray-900 hover:border-gray-400"
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? loadingText : children}
        </button>
    );
}
