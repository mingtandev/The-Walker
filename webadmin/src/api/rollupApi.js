import axiosClient from "./axiosClient";

const rollupApi = {
  getAll: () => {
    const url = "/rolls";
    return axiosClient.get(url, { params: { limit: 1000000000 } });
  },
  delete: (day) => {
    const url = "/rolls/" + day;
    return axiosClient.delete(url);
  },
  create: (body) => {
    const url = "/rolls";
    return axiosClient.post(url, body);
  },
  update: (day, body) => {
    const url = `/rolls/${day}`;
    return axiosClient.patch(url, body);
  },
};

export default rollupApi;
