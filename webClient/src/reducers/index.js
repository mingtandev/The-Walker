import { combineReducers } from "redux";
import authReducer from "./authReducer";
import blogReducer from "./blogReducer";
import itemsReducer from "./itemsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  blog: blogReducer,
  items: itemsReducer,
});

export default rootReducer;
