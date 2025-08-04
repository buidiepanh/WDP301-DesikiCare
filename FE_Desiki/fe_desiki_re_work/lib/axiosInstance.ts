import axios, { AxiosRequestConfig, Method } from "axios";
import { store } from "@/app/store";
import { isTokenValid, getCurrentToken } from "@/lib/utils";
console.log("API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

const loginRequiredApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

// Request interceptor - gắn token nếu có
loginRequiredApi.interceptors.request.use(
  (config) => {
    const token = getCurrentToken();
    if (!token) {
      return Promise.reject(
        new Error("No authentication token found. Please login first.")
      );
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý token hết hạn
loginRequiredApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      // Có thể dispatch action để logout user
      // store.dispatch(userSlice.actions.logout());

      // Redirect to login page hoặc show notification
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

type RequestProps = {
  instance: typeof publicApi | typeof loginRequiredApi;
  method: Method;
  url: string;
  data?: any;
  params?: any;
};

// Helper function để check xem có cần login không
export const requiresAuth = (
  instance: typeof publicApi | typeof loginRequiredApi
): boolean => {
  return instance === loginRequiredApi;
};

export const apiRequest = async ({
  instance,
  method,
  url,
  data,
  params,
}: RequestProps) => {
  // Check authentication nếu dùng loginRequiredApi
  if (requiresAuth(instance) && !isTokenValid()) {
    throw new Error("Authentication required. Please login to continue.");
  }

  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      params,
    };

    const response = await instance.request(config);
    return response.data;
  } catch (error: any) {
    // Log error for debugging
    console.error("API Request Error:", error);

    // Throw error với message rõ ràng
    if (error.response) {
      // Server responded with error status
      throw new Error(
        error.response.data?.message || `API Error: ${error.response.status}`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};

export { publicApi, loginRequiredApi };
