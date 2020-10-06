import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token") || null;
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
  (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url ===
        process.env.REACT_APP_BASE_URL + "/users/login/refresh"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      console.log("refreshToken fail");
      return;
    }
    if (
      error.response.status === 401 &&
      originalRequest.url ===
        `${process.env.REACT_APP_BASE_URL}/users/login/refresh`
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      console.log("day ne");
      return;
    }
    if (error.response.status === 401) {
      axiosClient
        .post("/users/login/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        })
        .then((res) => {
          console.log("new: ", res);
          localStorage.setItem("token", res.token);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.token}`;
          return axiosClient(originalRequest);
        })
        .catch((error) => {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          console.log("day ne", error);
        });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
