import api from "../lib/axios";
import { GetProfileResponse } from "../types/user.types";


// Get current user profile
export const getUserProfile = () => {
    return api.get<GetProfileResponse>("/profile");
};

// Update user profile
export const updateUserProfile = (data: {
    name?: string;
    email?: string;
    contact_no?: string;
}) => {
    return api.put("/user/profile", data);
};

// Change password
export const changePassword = (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
}) => {
    return api.post("/password/update", data);
};

// Upload profile picture
export const uploadProfilePicture = (file: File) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    return api.post("/user/profile-picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
