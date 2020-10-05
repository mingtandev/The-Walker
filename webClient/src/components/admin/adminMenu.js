import React from "react";
import { Link } from "react-router-dom";

function AdminMenu() {
  return (
    <div className="admin__menu">
      <ul>
        <li>
          <Link to="/admin/blog/create">Blog create</Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminMenu;
