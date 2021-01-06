import { combineReducers } from "redux";
import authReducer from "./authReducer";
import usersReducer from "./usersReducer";
import itemsReducer from "./itemsReducer";
import giftcodeReducer from "./giftcodeReducer";
import rollupReducer from "./rollupReducer";
import blogReducer from "./blogReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  items: itemsReducer,
  codes: giftcodeReducer,
  rollup: rollupReducer,
  blogs: blogReducer,
});

export default rootReducer;
