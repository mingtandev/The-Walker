import * as actionType from "./actionDefine";

export const loadUser = (users) => {
  return {
    type: actionType.USERS_LOADED,
    payload: users,
  };
};

export const deleteUser = (id) => {
  return {
    type: "USERS_DELETE",
    payload: id,
  };
};
