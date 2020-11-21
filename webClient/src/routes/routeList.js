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

const UserInfo = lazy(() => import("../container/auth/userInfo"));
const BlogByID = lazy(() => import("../components/blog/blogDetail"));
const ItemByID = lazy(() => import("../components/item/itemByID"));
const AcccountVerify = lazy(() => import("../pages/auth/accountVerify"));

const routes = [
  { path: "/", exact: true, component: Home },
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
  // {
  //   path: "/shop/:id",
  //   component: ItemByID,
  // },
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
  // {
  //   path: `/blog/:id`,
  //   component: BlogByID,
  // },
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
