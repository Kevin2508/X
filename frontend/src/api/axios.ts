import axios, { type AxiosInstance } from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL ?? "http://localhost:3000/api";

const API: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  // If you rely on express-session for captcha, you likely need this:
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;