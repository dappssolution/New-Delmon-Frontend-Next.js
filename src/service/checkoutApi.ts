import api from "../lib/axios";
import {
    CountryGetResponse,
    EmirateGetResponse,
    OrderCreateResponse,
    StripeConfirmResponse,
} from "../types/checkout.types";

export interface PlaceOrderPayload {
    shipping_name: string;
    shipping_phone: string;
    shipping_email: string;
    shipping_address: string;
    country_id: number;
    emirate_id: number;
    address_type: string;
    building_details: string;
    city: string;
    longitude?: string;
    latitude?: string;
    payment_method: string;
    note?: string;
}

export const checkoutApi = {
    async getCountries() {
        const res = await api.get<CountryGetResponse>("/countries");
        return res.data.data;
    },

    async getEmirates() {
        const res = await api.get<EmirateGetResponse>(`/emirates`);
        return res.data.data;
    },

    async placeOrder(payload: PlaceOrderPayload) {
        const res = await api.post<OrderCreateResponse>(
            "/checkout/place-order",
            payload
        );
        return res.data;
    },

    async confirmStripePayment(paymentIntentId: string) {
        const res = await api.post<StripeConfirmResponse>(
            "/checkout/stripe/confirm",
            { payment_intent_id: paymentIntentId }
        );
        return res.data;
    },
};

