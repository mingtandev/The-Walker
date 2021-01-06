import * as actions from "../actions/actionDefine";

const initialState = {
  giftcodes: [],
  status: "",
};

const giftcodeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GIFTCODE_LOAD:
      return {
        ...state,
        giftcodes: action.payload,
      };
    case actions.GIFTCODE_DELETE:
      let newGiftcodes = [...state.giftcodes];
      let deleteCode = action.payload;
      newGiftcodes = newGiftcodes.filter(function (code) {
        return code.code !== deleteCode;
      });
      return {
        ...state,
        giftcodes: newGiftcodes,
      };
    default:
      return { ...state };
  }
};

export default giftcodeReducer;
