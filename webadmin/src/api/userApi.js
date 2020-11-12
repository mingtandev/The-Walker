import axiosClient from "./axiosClient";

const userApi = {
  getAll: () => {
    const url = "/users";
    return axiosClient.get(url);
  },
  getUserInfo: () => {
    const url = "/users/information";
    return axiosClient.get(url);
  },
  signIn: (body) => {
    const url = "/users/login";
    return axiosClient.post(url, body);
  },
  signUp: (body) => {
    const url = "/users";
    return axiosClient.post(url, body);
  },
  changePass: (body) => {
    const url = "/users/information";
    return axiosClient.post(url, body);
  },
  forgot: (body) => {
    const url = "/users/recovery";
    return axiosClient.post(url, body);
  },
  forgotConfirm: (body) => {
    const url = "/users/forgot";
    return axiosClient.post(url, body);
  },
  delete: (userId) => {
    const url = "/users/" + userId;
    return axiosClient.delete(url);
  },
};

export default userApi;
