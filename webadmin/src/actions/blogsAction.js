import * as actionType from "./actionDefine";

export const loadBlogs = (blogs) => {
  return {
    type: actionType.BLOGS_LOADED,
    payload: blogs,
  };
};

export const deleteBlog = (idArray) => {
  return {
    type: actionType.BLOGS_DELETE,
    payload: idArray,
  };
};
