import axiosClient from "./axiosClient";

const rollApi = {
  get: (params) => {
    const url = "/rolls";
    return axiosClient.get(url, { params });
  },
  use: (rollDay) => {
    const url = `/rolls/${rollDay}`;
    return axiosClient.post(url);
  },
};

export default rollApi;
