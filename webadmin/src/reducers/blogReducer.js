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
    case "BLOGS_DELETE":
      let newBlogs = [...state.blogs];
      let deleteID = action.payload;
      newBlogs = newBlogs.filter(function (item) {
        return item._id !== deleteID;
      });
      console.log("new", newBlogs);
      return {
        ...state,
        blogs: newBlogs,
      };
    default:
      return { ...state };
  }
};

export default blogReducer;
