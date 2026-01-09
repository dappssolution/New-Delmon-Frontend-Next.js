import api from "../lib/axios";
import {
    DivisionGetResponse,
    DistrictGetResponse,
    StateGetResponse,
    OrderCreateResponse,
    StripeConfirmResponse,
} from "../types/checkout.types";

export interface PlaceOrderPayload {
    shipping_name: string;
    shipping_phone: string;
    shipping_email: string;
    shipping_address: string;
    devision_id?: number;
    district_id?: number;
    state_id?: number;
    post_code?: string;
    payment_method: string;
}

export const checkoutApi = {
    async getDivisions() {
        const res = await api.get<DivisionGetResponse>("/divisions");
        return res.data.data;
    },

    async getDistricts(divisionId: number) {
        const res = await api.get<DistrictGetResponse>(`/districts/${divisionId}`);
        return res.data.data;
    },

    async getStates(districtId: number) {
        const res = await api.get<StateGetResponse>(`/states/${districtId}`);
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

