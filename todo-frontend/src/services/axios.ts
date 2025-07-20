import axios from "axios";
import { useAuthStore } from "../stores/auth";

export function setupAxios(): void {
  axios.defaults.baseURL = "http://localhost:8000";

  axios.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      const token = authStore.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
