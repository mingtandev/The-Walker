import axiosClient from "./axiosClient";

const userApi = {
  get: (params) => {
    const url = "/users";
    return axiosClient.get(url, { params });
  },
  getUserInfo: () => {
    const url = "/users/information";
    return axiosClient.get(url);
  },
  post: (body) => {
    const url = "/users/login";
    return axiosClient.post(url, body);
  },
  signUp: (body) => {
    const url = "/users/signup";
    return axiosClient.post(url, body);
  },
  changePass: (body) => {
    const url = "/users/information";
    return axiosClient.post(url, body);
  },
  delete: (body) => {
    const url = "/users/delete";
    return axiosClient.post(url, body);
  },
};
export default userApi;
