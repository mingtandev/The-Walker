import axiosClient from "./axiosClient";

const itemApi = {
  getAll: (params) => {
    const url = "/items";
    return axiosClient.get(url, params);
  },
  getOne: (id) => {
    const url = `/items/${id}`;
    return axiosClient.get(url);
  },
  buyOne: (itemID) => {
    const url = `/items/${itemID}`;
    return axiosClient.post(url);
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
