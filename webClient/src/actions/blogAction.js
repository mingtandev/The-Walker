export const blogLoading = () => {
  return {
    type: "BLOG_LOADING",
  };
};

export const blogLoaded = (blogs) => {
  return {
    type: "BLOG_LOADED",
  };
};

export const blogFailLoaded = () => {
  return {
    type: "BLOG_FAIL",
  };
};
