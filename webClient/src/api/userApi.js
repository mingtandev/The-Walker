import axiosClient from "./axiosClient";

const userApi = {
  get: (params) => {
    const url = "/users";
    return axiosClient.get(url, { params });
  },
  post: (body, params) => {
    const url = "/users/login";
    return axiosClient.post(url, body, { params });
  },
};
export default userApi;
