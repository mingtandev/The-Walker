export const itemsLoading = () => {
  return {
    type: "ITEMS_LOADING",
  };
};

export const itemsLoaded = (blogs) => {
  return {
    type: "ITEMS_LOADED",
  };
};

export const itemsFailLoaded = () => {
  return {
    type: "ITEMS_FAIL",
  };
};
