import api from "../lib/axios";
import { GetDashboardDataResponse, GetOrderDetailsResponse, GetProfileResponse, GetReturnOrdersResponse, GetUserOrdersResponse } from "../types/user.types";

export const getUserProfile = () => {
    return api.get<GetProfileResponse>("/profile");
};

export const updateUserProfile = (data: FormData) => {
    return api.post("/profile/update", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const changePassword = (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
}) => {
    return api.post("/password/update", data);
};

export const getUserOrders = async () => {
    const res = await api.get<GetUserOrdersResponse>("/user/orders");
    return res.data;
};

export const getOrderDetails = async (id: number) => {
    const res = await api.get<GetOrderDetailsResponse>(`/user/order/${id}`);
    return res.data;
};

export const getReturnOrders = async () => {
    const res = await api.get<GetReturnOrdersResponse>("/user/returned-orders");
    return res.data;
};

export const trackOrder = async (code: string) => {
    const res = await api.post<GetUserOrdersResponse>("/order/track", { code });
    return res.data;
}

export const returnOrder = async (id: number, reason: string) => {
    const res = await api.post(`/user/order/return/${id}`, { return_reason: reason });
    return res.data;
}
export const getDashboardData = async () => {
    const res = await api.get<GetDashboardDataResponse>("/dashboard");
    return res.data;
};
