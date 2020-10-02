const initialState = {
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: null,
  isLoading: false,
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
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      console.log("case: ", action.payload);
      console.log(localStorage.getItem("token"));
      state = {
        ...state,
        token: localStorage.getItem("token"),
        refreshToken: localStorage.getItem("refreshToken"),
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
      // localStorage.setItem("user", JSON.stringify(state));
      return state;
    case "LOGOUT_SUCCESS":
      // localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return { ...state };
  }
};

export default authReducer;
