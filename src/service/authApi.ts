import api from "../lib/axios";


export const authApi = {
    async forgotPassword(email: string) {
        const res = await api.post("/password/forgot", { email });
        return res.data;
    },

    async resetPassword(data: {
        email: string;
        code: string;
        password: string;
        password_confirmation: string;
    }) {
        const res = await api.post("/password/reset", data);
        return res.data;
    },

    async logout() {
        const res = await api.post("/logout");
        return res.data;
    },
}