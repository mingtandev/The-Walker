import axiosClient from "./axiosClient";

const giftcodeApi = {
  getAll: () => {
    const url = "/giffcodes";
    return axiosClient.get(url, { params: { limit: 1000000000 } });
  },
  delete: (codeId) => {
    const url = "/giffcodes/" + codeId;
    return axiosClient.delete(url);
  },
  create: (body) => {
    const url = "/giffcodes";
    return axiosClient.post(url, body);
  },
  update: (codeId, body) => {
    const url = `/giffcodes/${codeId}`;
    return axiosClient.patch(url, body);
  },
};

export default giftcodeApi;
