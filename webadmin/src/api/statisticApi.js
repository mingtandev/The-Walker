import axiosClient from "./axiosClient";

const statisticApi = {
  get: (params) => {
    const url = "/statistics";
    return axiosClient.get(url, { params });
  },
  getChart: () => {
    const url = "/statistics/chart-data";
    return axiosClient.get(url);
  },
};

export default statisticApi;
