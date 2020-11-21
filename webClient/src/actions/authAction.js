export const signIn = (user) => {
  return {
    type: "LOGIN_SUCCESS",
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
    payload: null,
  };
};

export const loadUser = (user) => {
  return {
    type: "USER_LOADED",
    payload: user,
  };
};
