import * as actionType from "./actionDefine";

export const loadGiftcodes = (blogs) => {
  console.log("loading");
  return {
    type: actionType.GIFTCODE_LOAD,
    payload: blogs,
  };
};

export const deleteGiftcode = (code) => {
  return {
    type: actionType.GIFTCODE_DELETE,
    payload: code,
  };
};
