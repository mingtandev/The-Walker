const initialState = {
  user: null,
  status: "",
};

console.log(initialState);

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOAD":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        status: "logged_in",
      };
    case "REGISTER_SUCCESS":
      state = {
        ...state,
        user: action.payload,
      };
      // localStorage.setItem("user", JSON.stringify(state));
      return state;
    case "LOGOUT_SUCCESS":
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return {
        ...state,
        user: null,
      };
    default:
      return { ...state };
  }
};

export default authReducer;
