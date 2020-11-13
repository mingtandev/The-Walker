import axiosClient from "./axiosClient";

const blogApi = {
  getAll: () => {
    const url = "/blogs";
    return axiosClient.get(url, { params: { limit: 1000000000 } });
  },
  getOne: (id) => {
    const url = `/blogs/${id}`;
    return axiosClient.get(url);
  },
  create: (body) => {
    const url = "/blogs";
    return axiosClient.post(url, body);
  },
  delete: (id) => {
    const url = `/blogs/${id}`;
    return axiosClient.delete(url);
  },
  update: (id, body) => {
    const url = `/blogs/${id}`;
    return axiosClient.patch(url, body);
  },
};

export default blogApi;
