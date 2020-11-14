import * as actions from "../actions/actionDefine";

const initialState = {
  items: [],
  status: "",
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ITEMS_LOADED":
      return {
        ...state,
        items: action.payload,
      };
    case actions.ITEM_DELETE:
      let newItems = [...state.items];
      let deleteID = action.payload;
      newItems = newItems.filter(function (item) {
        return item._id !== deleteID;
      });
      return {
        ...state,
        items: newItems,
      };
    default:
      return { ...state };
  }
};

export default itemsReducer;
