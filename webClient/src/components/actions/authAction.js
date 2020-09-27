export const signIn = ({ username, password }) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: { username, password },
  };
};

export const signup = ({ email, password, username }) => {
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
