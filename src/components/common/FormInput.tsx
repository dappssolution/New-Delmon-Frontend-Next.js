import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    error?: string;
}

export default function FormInput({
    name,
    label,
    error,
    className = "",
    ...props
}: FormInputProps) {
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
            <input
                id={name}
                name={name}
                className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
}
