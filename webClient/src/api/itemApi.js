import axiosClient from "./axiosClient";

const itemApi = {
  getAll: () => {
    const url = "/items";
    return axiosClient.get(url);
  },
  getOne: (id) => {
    const url = `/items/${id}`;
    return axiosClient.get(url);
  },
  create: (body) => {
    const url = "";
    return axiosClient.get(url);
  },
  delete: (id) => {
    const url = `/items/${id}`;
    return axiosClient.get(url);
  },
};

export default itemApi;
