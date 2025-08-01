import axios from "axios";
import Swal from "sweetalert2";
import { getAccessToken, hasRole } from "../utils/auth";

// ✅ Base URL mặc định
<<<<<<< HEAD
let baseURL = "https://wdp301-desikicare.onrender.com";

=======
let baseURL = import.meta.env.VITE_API_BASE_URL || "";
console.log("Alo: ", import.meta.env.VITE_API_BASE_URL);
>>>>>>> 1593df98b175df36216e408317abc8bf884a21d3
// ✅ Cho phép cập nhật baseURL
export const setBaseURL = (url: string) => {
  baseURL = url;
};

// ✅ Khởi tạo instance Axios
const axiosInstance = axios.create({
  baseURL,
  timeout: 60000,
});

// ✅ API không cần Auth
export const callAPIUnAuth = async ({
  method = "GET",
  url,
  data,
  params,
  headers = {},
}: {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}) => {
  try {
    const response = await axiosInstance.request({
      method,
      url,
      data,
      params,
      headers: {
        "ngrok-skip-browser-warning": "69420",
        ...headers,
      },
    });
    return response;
  } catch (error: any) {
    console.error("❌ API UnAuth Error:", error);
    Swal.fire(
      "Lỗi!",
      error?.response?.data?.message || "Lỗi hệ thống!",
      "error"
    );
    throw error.response?.data || error.message;
  }
};

// ✅ API cho Manager (roleId: 1)
export const callAPIManager = async ({
  method = "GET",
  url,
  data,
  params,
  headers = {},
}: {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}) => {
  const token = getAccessToken();
  if (!hasRole([1])) {
    Swal.fire(
      "Không đủ quyền!",
      "Chỉ Manager mới được phép thao tác!",
      "warning"
    );
    return null;
  }

  try {
    const response = await axiosInstance.request({
      method,
      url,
      data,
      params,
      headers: {
        "ngrok-skip-browser-warning": "69420",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    });
    return response;
  } catch (error: any) {
    console.error("❌ API Manager Error:", error);
    Swal.fire(
      "Lỗi!",
      error?.response?.data?.message || "Lỗi hệ thống!",
      "error"
    );
    throw error.response?.data || error.message;
  }
};

// ✅ API cho Admin (roleId: 2)
export const callAPIAdmin = async ({
  method = "GET",
  url,
  data,
  params,
  headers = {},
}: {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}) => {
  const token = getAccessToken();
  if (!hasRole([2])) {
    Swal.fire(
      "Không đủ quyền!",
      "Chỉ Admin mới được phép thao tác!",
      "warning"
    );
    return null;
  }

  try {
    const response = await axiosInstance.request({
      method,
      url,
      data,
      params,
      headers: {
        "ngrok-skip-browser-warning": "69420",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    });
    return response;
  } catch (error: any) {
    console.error("❌ API Admin Error:", error);
    Swal.fire(
      "Lỗi!",
      error?.response?.data?.message || "Lỗi hệ thống!",
      "error"
    );
    throw error.response?.data || error.message;
  }
};
