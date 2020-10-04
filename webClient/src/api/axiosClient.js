import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log("res from server ", response);
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url ===
        `${process.env.REACT_APP_BASE_URL}/users/login/refresh`
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      console.log("day ne");
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      try {
        const newToken = await axiosClient.post("/users/login/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });
        console.log("new: ", newToken);
        localStorage.setItem("token", newToken.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken.token}`;
        return await axiosClient(originalRequest);
      } catch (error) {
        console.log("er", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    }
  }
);

export default axiosClient;
