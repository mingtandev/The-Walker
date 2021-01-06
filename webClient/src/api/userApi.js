import axiosClient from "./axiosClient";

const userApi = {
  get: (params) => {
    const url = "/users";
    return axiosClient.get(url, { params });
  },
  getOne: (id) => {
    const url = "/users/" + id;
    return axiosClient.get(url);
  },
  getUserInfo: (userID) => {
    const url = "/users/" + userID;
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
  update: (userID, body) => {
    const url = "/users/" + userID;
    return axiosClient.patch(url, body);
  },
  forgot: (body) => {
    const url = "/users/recovery";
    return axiosClient.post(url, body);
  },
  forgotConfirm: (body) => {
    const url = "/users/forgot";
    return axiosClient.post(url, body);
  },
  resend: (email) => {
    const url = "/users/confirm/resend";
    return axiosClient.post(url, email);
  },
  delete: (body) => {
    const url = "/users/" + body;
    return axiosClient.delete(url);
  },
};

export default userApi;
