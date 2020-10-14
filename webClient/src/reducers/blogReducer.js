const initialState = {
  status: "idle",
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BLOG_LOADING":
      return {
        ...state,
        status: "loading",
      };
    case "BLOG_LOADED":
      return {
        ...state,
        status: "success",
      };
    case "BLOG_FAIL":
      return {
        ...state,
        status: "fail",
      };
    default:
      return { ...state };
  }
};

export default blogReducer;
