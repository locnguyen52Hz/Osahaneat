import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const authApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
