// utils/axiosConfig.ts
import axios from "axios";

// Default baseURL – có thể được cập nhật sau
let baseURL = "https://5993-115-75-223-184.ngrok-free.app";

// Hàm để thay đổi baseURL khi cần
export const setBaseURL = (url: string) => {
  baseURL = url;
};

// Khởi tạo instance
export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // timeout 10s
});

// Hàm gọi API chung
export const callAPI = async ({
  method = "GET",
  url,
  data,
  params,
  headers,
}: {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: any;
  params?: any;
  headers?: any;
}) => {
  try {
    console.log("URL:", url);
    const response = await axiosInstance.request({
      method,
      url,
      data,
      params,
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
};
