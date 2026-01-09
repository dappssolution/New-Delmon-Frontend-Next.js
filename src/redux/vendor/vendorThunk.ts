import { vendorApis } from "@/src/service/vendorApi";
import {
    AllProductGetResponse,
    UpdateProductResponse,
    OrdersGetResponse,
    OrderDetailResponse,
    UpdateOrderStatusResponse,
    ProfileUpdateResponse,
    GetReturnOrderResponse
} from "@/src/types/vendor.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVendorProducts = createAsyncThunk(
    "vendor/fetchVendorProducts",
    async (params: { page?: number; per_page?: number; search?: string } = {}, { rejectWithValue }) => {
        try {
            const response = await vendorApis.getProducts(params);
            return response as AllProductGetResponse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to fetch products");
        }
    }
);

export const deleteVendorProduct = createAsyncThunk(
    "vendor/deleteVendorProduct",
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await vendorApis.deleteProduct(productId);
            return { productId, response };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to delete product");
        }
    }
);

export const updateVendorProduct = createAsyncThunk(
    "vendor/updateVendorProduct",
    async ({ productId, productData }: { productId: string; productData: FormData }, { rejectWithValue }) => {
        try {
            const response = await vendorApis.updateProduct(productId, productData);
            return response as UpdateProductResponse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to update product");
        }
    }
);

export const fetchVendorOrders = createAsyncThunk(
    "vendor/fetchVendorOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await vendorApis.getAllOrders();
            return response as OrdersGetResponse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to fetch orders");
        }
    }
);

export const fetchOrderDetail = createAsyncThunk(
    "vendor/fetchOrderDetail",
    async (orderId: string, { rejectWithValue }) => {
        try {
            const response = await vendorApis.OrderDetails(orderId);
            return response as OrderDetailResponse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to fetch order details");
        }
    }
);

export const updateVendorOrderStatus = createAsyncThunk(
    "vendor/updateVendorOrderStatus",
    async ({ orderId, status }: { orderId: string; status: string }, { rejectWithValue }) => {
        try {
            const response = await vendorApis.updateOrderStatus(orderId, status);
            return response as UpdateOrderStatusResponse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to update order status");
        }
    }
);

export const updateVendorProfile = createAsyncThunk(
    "vendor/updateVendorProfile",
    async (profileData: FormData, { rejectWithValue }) => {
        try {
            const response = await vendorApis.updateProfile(profileData);
            return response as ProfileUpdateResponse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to update profile");
        }
    }
);

export const fetchVendorReturnOrders = createAsyncThunk(
    "vendor/fetchVendorReturnOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await vendorApis.getReturnOrders();
            return response as GetReturnOrderResponse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || "Failed to fetch return orders");
        }
    }
);
