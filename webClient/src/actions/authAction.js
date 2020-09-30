import userApi from "../api/userApi";

export const signIn = ({ email, password }) => {
  // let res = await userApi.post({ email, password });
  // console.log(res);
  return {
    type: "LOGIN_SUCCESS",
    payload: { email, password },
  };
};

export const signup = ({ email, password, username, avatar }) => {
  return {
    type: "REGISTER_SUCCESS",
    payload: { email, password, username, avatar },
  };
};

export const signOut = () => {
  return {
    type: "LOGOUT_SUCCESS",
  };
};
