import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usersReducer from "./users";
import itemsReducer from "./itemsReducer";

import { routerReducer } from "react-router-redux";
import blogReducer from "./blogReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  items: itemsReducer,
  blogs: blogReducer,
  // routing: routerReducer,
});

export default rootReducer;
