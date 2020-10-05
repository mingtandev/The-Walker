import React from "react";
import Menu from "./adminMenu";

const BlogCreate = React.lazy(() => import("../blog/blogCreate"));

function Admin() {
  return (
    <div className="admin">
      <Menu />
      <div className="admin__main"></div>
    </div>
  );
}

export default Admin;
