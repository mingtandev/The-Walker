import * as actionType from "./actionDefine";

export const loadGiftcodes = (codes) => {
  return {
    type: actionType.GIFTCODE_LOAD,
    payload: codes,
  };
};

export const deleteGiftcode = (code) => {
  return {
    type: actionType.GIFTCODE_DELETE,
    payload: code,
  };
};
