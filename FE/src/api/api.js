import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL

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


//get
export const apiGet = async (url, params = {}) =>{
    const axiosInstance = createAuthorizedAxios()
    return axiosInstance.get(url, {params})
}

// post
export const apiPost = async (url, data = {}) =>{
    const axiosInstance = createAuthorizedAxios()
    return axiosInstance.post(url, data)
}
