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
    default:
      return { ...state };
  }
};

export default itemsReducer;
