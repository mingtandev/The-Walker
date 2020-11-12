import * as actionType from "./actionDefine";

export const loadItems = (items) => {
  console.log("loading");
  return {
    type: actionType.ITEMS_LOADED,
    payload: items,
  };
};

export const deleteUser = (id) => {
  return {
    type: "USERS_DELETE",
    payload: id,
  };
};
