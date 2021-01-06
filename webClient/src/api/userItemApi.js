import axiosClient from "./axiosClient";

const userItemApi = {
  getAll: (params) => {
    const url = "/user-items";
    return axiosClient.get(url, { params });
  },
  getOne: (userID) => {
    const url = "/user-items/" + userID;
    return axiosClient.get(url);
  },
  create: (userID) => {
    const url = "/user-items";
    return axiosClient.post(url, { userId: userID });
  },
};

export default userItemApi;
