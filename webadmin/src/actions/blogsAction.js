import * as actionType from "./actionDefine";

export const loadBlogs = (blogs) => {
  console.log("loading");
  return {
    type: actionType.BLOGS_LOADED,
    payload: blogs,
  };
};
