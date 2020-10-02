export const signIn = (user) => {
  console.log("action: ", user);
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
    payload: "",
  };
};
