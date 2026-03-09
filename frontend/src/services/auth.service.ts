import axiosInstance from "../utils/axiosInstance";

/**
 * Authentication Service
 * Handles all auth-related API calls
 */

export const registerUser = async (userData: any) => {
    const response = await axiosInstance.post('/users/register', userData);
    return response.data;
};

export const loginUser = async (credentials: any) => {
    const response = await axiosInstance.post('/users/login', credentials);
    return response.data;
};

export const verifyOTP = async (otpData: { email: string; otp: string }) => {
    const response = await axiosInstance.post('/users/verify-otp', otpData);
    return response.data;
};

export const googleAuthSync = async (authData: { code: string; redirectUri: string }) => {
    const response = await axiosInstance.post('/users/google-auth', authData);
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.post('/users/logout');
    return response.data;
};

export const refreshAccessToken = async () => {
    const response = await axiosInstance.post('/users/refresh-token');
    return response.data;
};

export const updateAccountDetails = async (userData: { name: string }) => {
    const response = await axiosInstance.patch('/users/update-account', userData);
    return response.data;
};
