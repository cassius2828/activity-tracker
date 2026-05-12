// frontend/src/service/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // use VITE_ prefix
  withCredentials: true,
});