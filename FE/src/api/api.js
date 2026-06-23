import axios from "axios";
import { data } from "react-router-dom";
const baseURL = import.meta.env.VITE_BASE_URL;

const createAuthorizedAxios = () => {
  const token = localStorage.getItem("token");

  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const createAuthorizedAxiosFile = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//get
export const apiGet = async (url, config = {}) => {
  const axiosInstance = createAuthorizedAxios();
  return axiosInstance.get(url, config);
};

// post
export const apiPost = async (url, data = {}) => {
  const axiosInstance = createAuthorizedAxios();
  return axiosInstance.post(url, data);
};

// put
export const apiPut = async (url, data = {}) => {
  const axiosInstance = createAuthorizedAxios();
  return axiosInstance.put(url, data);
};

// post file
export const apiPostFile = async (url, data = {}) => {
  const axiosInstance = createAuthorizedAxiosFile();
  return axiosInstance.post(url, data);
};

// path
export const apiPatch = async (url, data = {}) => {
  const axiosInstance = createAuthorizedAxios();
  return axiosInstance.patch(url, data);
};

//path file
export const apiPatchFile = async (url, data = {}) => {
  const axiosInstance = createAuthorizedAxiosFile();
  return axiosInstance.patch(url, data);
};

// delete
export const apiDelete = async (url, data = {}) => {
  const axiosInstance = createAuthorizedAxios();
  return axiosInstance.delete(url, data);
};
