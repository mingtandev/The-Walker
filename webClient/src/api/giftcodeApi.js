import axiosClient from "./axiosClient";

const giftcodeApi = {
  get: () => {
    const url = "/giffcodes";
    return axiosClient.get(url);
  },
  getOne: (rollDay) => {
    const url = `/giffcodes/${rollDay}`;
    return axiosClient.get(url);
  },
};

export default giftcodeApi;
