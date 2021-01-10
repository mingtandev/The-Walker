import * as actionType from "./actionDefine";

export const signIn = (user) => {
  return {
    type: actionType.LOGIN_REQUEST,
    payload: user,
  };
};

export const signInSuccess = (user, token) => {
  localStorage.setItem("token", token);
  return {
    type: actionType.LOGIN_SUCCESS,
    payload: user,
  };
};

export const signUp = ({ email, password, username }) => {
  return {
    type: "REGISTER_SUCCESS",
    payload: { email, password, username },
  };
};

export const signOut = () => {
  return {
    type: "LOGOUT_SUCCESS",
  };
};

export const loadUser = (user) => {
  return {
    type: "USER_LOAD",
    payload: user,
  };
};
