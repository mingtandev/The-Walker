const initialState = {
  user: null,
};

console.log(initialState);

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOADING":
      return {
        ...state,
        isLoading: true,
        user: null,
      };
    case "USER_LOADED":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGIN_SUCCESS":
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
        user: action.payload,
      };
    default:
      return { ...state };
  }
};

export default authReducer;
