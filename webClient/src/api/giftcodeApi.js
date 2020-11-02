import axiosClient from "./axiosClient";

const giftcodeApi = {
  useOne: (code) => {
    const url = `/giffcodes/${code}`;
    return axiosClient.post(url);
  },
};

export default giftcodeApi;
