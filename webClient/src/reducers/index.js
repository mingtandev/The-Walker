import authReducer from "./authReducer";
import blogReducer from "./blogReducer";
import itemsReducer from "./itemsReducer";
import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";

const reducer = combineReducers({
  auth: authReducer,
  blog: blogReducer,
  items: itemsReducer,
  toastr: toastrReducer,
});

export default reducer;
