import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token") || null;
  config.headers["authorization"] = `Bearer ${token}`;
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
    if (error.response.status === 401) {
      if (originalRequest.url === "/users/login/refresh") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        console.log("get refreshToken failed");
        return;
      }
      axiosClient
        .post("/users/login/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        })
        .then((res) => {
          if (res && res.msg === "success") {
            console.log("new: ", res);
            localStorage.setItem("token", res.token);
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.token}`;
            console.log("orginal req: ", originalRequest);
            return axiosClient(originalRequest);
          }
        })
        .catch((error) => {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          console.log("day ne", error);
        });
    }
  }
);

export default axiosClient;
