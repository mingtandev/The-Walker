import axiosClient from "./axiosClient";

const rollApi = {
  get: () => {
    const url = "/rolls";
    return axiosClient.get(url);
  },
  getOne: (rollDay) => {
    const url = `/rolls/${rollDay}`;
    return axiosClient.get(url);
  },
};

export default rollApi;
