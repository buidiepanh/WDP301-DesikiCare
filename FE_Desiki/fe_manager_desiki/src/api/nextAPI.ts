import axios from "axios";

// Create axios instance for Next.js API (localhost:3000)
const nextAPI = axios.create({
  baseURL: import.meta.env.VITE_NEXT_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor if needed
nextAPI.interceptors.request.use(
  (config) => {
    console.log(
      "🚀 Next API Request:",
      config.method?.toUpperCase(),
      config.url
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
nextAPI.interceptors.response.use(
  (response) => {
    console.log("📥 Next API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Next API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export { nextAPI };
