import api from "../lib/axios"
import { AddProductResponse, UpdateProductResponse, OrdersGetResponse, OrderDetailResponse, UpdateOrderStatusResponse, ProfileUpdateResponse, GetReturnOrderResponse, DashboardStatsResponse } from "../types/vendor.types"


export const vendorApis = {
    async updateProfile(profileData: any) {
        const response = await api.post<ProfileUpdateResponse>('/vendor/profile/update', profileData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    async getProducts(params?: { page?: number; per_page?: number; search?: string }) {
        const response = await api.get('/vendor/products', { params })
        return response.data
    },

    async createProduct(productData: FormData) {
        const response = await api.post<AddProductResponse>('/vendor/product/store', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    async updateProduct(productId: string, productData: FormData) {
        const response = await api.post<UpdateProductResponse>(`/vendor/product/update/${productId}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    async deleteProduct(productId: string) {
        const response = await api.delete(`/vendor/product/delete/${productId}`)
        return response.data
    },

    async getAllOrders() {
        const response = await api.get<OrdersGetResponse>('/vendor/orders')
        return response.data
    },

    async OrderDetails(orderId: string) {
        const response = await api.get<OrderDetailResponse>(`/vendor/order/details/${orderId}`)
        return response.data
    },

    async updateOrderStatus(orderId: string, status: string) {
        const response = await api.post<UpdateOrderStatusResponse>(`/vendor/order/status/update/${orderId}`, { status })
        return response.data
    },

    async getReturnOrders() {
        const response = await api.get<GetReturnOrderResponse>('/vendor/orders/returns')
        return response.data
    },

    async dashboardStats() {
        const response = await api.get<DashboardStatsResponse>('/vendor/dashboard/stats')
        return response.data
    }
}