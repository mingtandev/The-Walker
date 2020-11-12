const initialState = {
  blogs: [],
  status: "",
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BLOGS_LOADED":
      return {
        ...state,
        blogs: action.payload,
      };
    default:
      return { ...state };
  }
};

export default blogReducer;
