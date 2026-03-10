import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 403 and we haven't retried yet
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                await axiosInstance.post('/users/refresh-token');

                // If successful, retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, the user is likely truly logged out
                console.error("Session expired. Please log in again.");
                return Promise.reject(refreshError);
            }
        }

        const message = error.response?.data?.message || "Something went wrong";
        console.error("API Error:", message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
