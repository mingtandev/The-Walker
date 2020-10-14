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
    const url = "/items";
    return axiosClient.post(url, body);
  },
  delete: (id) => {
    const url = `/items/${id}`;
    return axiosClient.delete(url);
  },
};

export default itemApi;
