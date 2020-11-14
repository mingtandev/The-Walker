import React from "react";
import Dashboard from "./container/dashboard";
import Users from "./container/users";
import ItemList from "./container/items/itemList";
import CodeList from "./container/giftcode/codeList";
import RollUpList from "./container/rollup/rollupList";
import BlogList from "./container/blog/blogList";
import RollUpCreate from "./container/rollup/rollupCreate";

const ItemCreate = React.lazy(() => import("./container/items/itemCreate"));
const CodeCreate = React.lazy(() => import("./container/giftcode/codeCreate"));
const BlogCreate = React.lazy(() => import("./container/blog/blogCreate"));

const routes = [
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/users", exact: true, name: "Dashboard", component: Users },
  { path: "/items", exact: true, name: "Items", component: ItemList },
  {
    path: "/items/create",
    exact: false,
    name: "ItemsCreate",
    component: ItemCreate,
  },
  { path: "/giftcode", exact: true, name: "Giftcode", component: CodeList },
  { path: "/giftcode/create", name: "GiftcodeCreate", component: CodeCreate },
  { path: "/rollup", exact: true, name: "RollUp", component: RollUpList },
  { path: "/rollup/create", name: "RollUpCreate", component: RollUpCreate },
  { path: "/blogs", exact: true, name: "Blog", component: BlogList },
  { path: "/blogs/create", name: "BlogCreate", component: BlogCreate },
];

export default routes;
