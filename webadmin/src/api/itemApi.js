import axiosClient from "./axiosClient";

const itemApi = {
  getAll: () => {
    const url = "/items";
    return axiosClient.get(url, { params: { limit: 1000000000 } });
  },
  getOne: (id) => {
    const url = `/items/${id}`;
    return axiosClient.get(url);
  },
  buyOne: (itemID) => {
    const url = `/items/${itemID}`;
    return axiosClient.post(url);
  },
  update: (itemID, body) => {
    const url = `/items/${itemID}`;
    return axiosClient.patch(url, body);
  },
  create: (formData) => {
    const url = "/items";
    return axiosClient.post(url, formData);
  },
  delete: (id) => {
    const url = `/items/${id}`;
    return axiosClient.delete(url);
  },
};

export default itemApi;
