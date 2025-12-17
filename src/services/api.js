// import axios from "axios";

// export const API_BASE_URL = "https://masmaexpo.demovoting.com/api";
// export const IMAGE_PATH = "https://masmaexpo.demovoting.com/uploads";

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosInstance;

// frontend/src/services/api.js
import axios from "axios";

export const API_BASE_URL = "https://masmaexpo.demovoting.com/api";
export const IMAGE_PATH = "https://masmaexpo.demovoting.com/uploads";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Request interceptor to add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("auth_token");
      localStorage.removeItem("company");

      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
