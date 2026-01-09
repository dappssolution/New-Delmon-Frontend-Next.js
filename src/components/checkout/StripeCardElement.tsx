"use client";

import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#1f2937",
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#9ca3af",
            },
            iconColor: "#6b7280",
        },
        invalid: {
            color: "#ef4444",
            iconColor: "#ef4444",
        },
    },
    hidePostalCode: true,
};

interface StripeCardElementProps {
    onChange?: (event: any) => void;
    disabled?: boolean;
}

export default function StripeCardElement({ onChange, disabled }: StripeCardElementProps) {
    return (
        <div className={`p-4 border border-gray-300 rounded-lg bg-white ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <CardElement options={CARD_ELEMENT_OPTIONS} onChange={onChange} />
        </div>
    );
}
