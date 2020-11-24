import axiosClient from "./axiosClient";

const statisticApi = {
  get: (params) => {
    const url = "/statistics";
    return axiosClient.get(url, { params });
  },
};

export default statisticApi;
