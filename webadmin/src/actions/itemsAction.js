import * as actionType from "./actionDefine";

export const loadItems = (items) => {
  return {
    type: actionType.ITEMS_LOADED,
    payload: items,
  };
};

export const deleteItem = (id) => {
  return {
    type: actionType.ITEM_DELETE,
    payload: id,
  };
};
