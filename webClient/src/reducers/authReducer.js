const initialState = JSON.parse(localStorage.getItem("user")) || {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOADING":
      return {
        ...state,
        isAuthenticated: null,
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
      state = { ...state, isAuthenticated: true, user: action.payload };
      localStorage.setItem("user", JSON.stringify(state));
      return state;
    case "LOGOUT_SUCCESS":
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return { ...state };
  }
};

export default authReducer;
