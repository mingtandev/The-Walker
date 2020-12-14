import { lazy } from "react";

import Home from "../pages/home";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Shop from "../pages/shop";
import RollUp from "../pages/rollup";
import GiftcodePage from "../pages/giftcode";
import Blog from "../pages/blog";
import ForgotPassword from "../pages/auth/forgot";
import NotFound from "../components/notFound";

const UserItem = lazy(() => import("../container/userItems"));
const UserInfo = lazy(() => import("../container/auth/userInfo"));
const AcccountVerify = lazy(() => import("../pages/auth/accountVerify"));

const routes = [
  { path: "/", exact: true, component: Home },
  { path: "/my-items", exact: true, component: UserItem },
  {
    path: "/sign-in",
    role: "noAuth",
    component: Login,
  },
  {
    path: "/sign-up",
    role: "noAuth",
    component: Register,
  },
  {
    path: "/shop",
    exact: true,
    component: Shop,
  },
  {
    path: "/roll-up",
    role: "user",
    component: RollUp,
  },
  {
    path: "/giftcode",
    role: "user",
    component: GiftcodePage,
  },
  {
    path: "/blog",
    exact: true,
    component: Blog,
  },
  {
    path: "/account/forgot",
    role: "noAuth",
    component: ForgotPassword,
  },
  {
    path: "/account/verify",
    role: "noAuth",
    component: AcccountVerify,
  },
  {
    path: "/user",
    exact: true,
    role: "user",
    component: UserInfo,
  },
  {
    component: NotFound,
  },
];

export default routes;
