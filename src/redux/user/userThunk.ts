import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfile, changePassword } from "@/src/service/userApi";

export const fetchUserProfile = createAsyncThunk(
    "user/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUserProfile();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user profile"
            );
        }
    }
);

export const updateUserPassword = createAsyncThunk(
    "user/updatePassword",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await changePassword(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update password"
            );
        }
    }
);
