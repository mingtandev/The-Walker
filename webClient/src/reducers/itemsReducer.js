const initialState = {
  status: "idle",
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ITEMS_LOADING":
      return {
        ...state,
        status: "loading",
      };
    case "ITEMS_LOADED":
      return {
        ...state,
        status: "success",
      };
    case "ITEMS_FAIL":
      return {
        ...state,
        status: "fail",
      };
    default:
      return { ...state };
  }
};

export default itemsReducer;
