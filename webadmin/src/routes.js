import React from "react";
import ItemList from "./container/items";
import BlogList from "./container/blog/blogList";

const Dashboard = React.lazy(() => import("./container/dashboard"));
const Users = React.lazy(() => import("./container/users"));
// const BlogList = React.lazy(() => import("./container/blog/blogList"));
const BlogCreate = React.lazy(() => import("./container/blog/blogCreate"));

const routes = [
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/users", exact: true, name: "Dashboard", component: Users },
  { path: "/items", exact: true, name: "Items", component: ItemList },
  { path: "/blogs", exact: true, name: "Blog", component: BlogList },
  { path: "/blogs/create", name: "BlogCreate", component: BlogCreate },
];

export default routes;
