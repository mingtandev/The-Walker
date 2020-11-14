import axiosClient from "./axiosClient";

const historyApi = {
  create: (userID) => {
    const url = `/histories`;
    return axiosClient.post(url, { userId: userID });
  },
};

export default historyApi;
