import { createSlice } from "@reduxjs/toolkit";
import { fetchUserProfile, updateUserPassword } from "./userThunk";
import { UserProfile } from "@/src/types/user.types";

interface UserState {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: UserState = {
    profile: null,
    loading: false,
    error: null,
    successMessage: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserMessage: (state) => {
            state.successMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Profile
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.user;
        });
        builder.addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Password
        builder.addCase(updateUserPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(updateUserPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload?.message || "Password updated successfully";
        });
        builder.addCase(updateUserPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearUserMessage } = userSlice.actions;
export default userSlice.reducer;
