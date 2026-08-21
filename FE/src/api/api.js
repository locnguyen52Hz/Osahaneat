import axios from "axios";
import { useAuthStore } from "../stores/Auth/useAuthStore";
const baseURL = import.meta.env.VITE_BASE_URL;

const createAuthorizedAxios = () => {
  const accessToken = useAuthStore.getState().accessToken;
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const createAuthorizedAxiosFile = () => {
  const accessToken = useAuthStore.getState().accessToken;
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest.hasRetried) {
      originalRequest.hasRetried = true;

      // gọi refresh
      const res = await useAuthStore.getState().refresh();

      // gắn token mới vào request cũ
      originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState.accessToken}`;

      // gọi lại request cũ
      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

api.interceptors.request.use((config) => {
  // console.log(config)
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// post file
export const apiPostFile = async (url, data = {}) => {
  const axiosInstance = createAuthorizedAxiosFile();
  return axiosInstance.post(url, data);
};

//path file
export const apiPatchFile = async (url, data = {}) => {
  const axiosInstance = createAuthorizedAxiosFile();
  return axiosInstance.patch(url, data);
};
