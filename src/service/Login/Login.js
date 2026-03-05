import axios from "axios";

const Base_Url = import.meta.env.VITE_API_URL;

// 1. Create axios instance
const api = axios.create({
  baseURL: Base_Url,
  headers: {
    "Content-Type": "application/json",
    // Adding ngrok skip header here just in case you are using it for development
    "ngrok-skip-browser-warning": "true",
  },
});

// 2. Add a Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Add a Response Interceptor (Handles Global Errors)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Case 1: Network Error (No response from server)
    if (!error.response) {
      window.location.href = "/network-error";
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Case 2: Unauthorized (401 - Token expired)
    if (status === 401) {
      // Only redirect if we aren't already on the login page to avoid loops
      if (window.location.pathname !== "/404") {
        window.location.href = "/404";
      }
    }

    // Case 3: Internal Server Error (500)
    else if (status === 500) {
      window.location.href = "/500";
    }

    return Promise.reject(error);
  }
);




// --- API EXPORTS ---

// FIX: Use 'api' instead of 'axios' so it gets the Error Interceptor logic
export const loginAPI = (payload) => {
  return api.post("/User/login", payload);
};

// Get Logged-in User
export const loginMeAPI = () => {
  return api.get("/customer-master/me/");
};

// Verify OTP
export const user_verify = (data) => {
  return api.post("/User/verify-otp/", data);
};

// Password Management
export const FirstTime_PasswordChange = (data) => {
  return api.post("/User/change-password/", data);
};

export const Forgot_password = (data) => {
  return api.post("/User/forgot-password/", data);
};

export const Forgot_Change_Password = (data) => {
  return api.post("/User/reset-password/", data);
};

export default api;