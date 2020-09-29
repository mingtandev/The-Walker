export const signIn = ({ username, password }) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: { username, password },
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
