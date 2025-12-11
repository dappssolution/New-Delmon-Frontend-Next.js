import api from "../lib/axios";

/**
 * Verify user email with the given id and hash
 * Authorization token is automatically added by axios interceptor
 */
export const verifyEmailApi = (id: string, hash: string) => {
    return api.get(`/email/verify/${id}/${hash}`);
};

