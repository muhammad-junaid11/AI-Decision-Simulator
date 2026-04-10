import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.token) {
          if (!config.headers) config.headers = {} as any;
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (err) {
      console.error("Failed to attach token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Logout if 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("userInfo");
      window.location.href = "/login"; // redirect automatically
    }
    return Promise.reject(err);
  }
);