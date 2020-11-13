import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usersReducer from "./usersReducer";
import itemsReducer from "./itemsReducer";
import giftcodeReducer from "./giftcodeReducer";
import rollupReducer from "./rollupReducer";
import { routerReducer } from "react-router-redux";
import blogReducer from "./blogReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  items: itemsReducer,
  codes: giftcodeReducer,
  rollup: rollupReducer,
  blogs: blogReducer,
  // routing: routerReducer,
});

export default rootReducer;
