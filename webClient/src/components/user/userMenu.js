import React from "react";
import { Link } from "react-router-dom";

function UserMenu() {
  return (
    <div className="userMenu">
      <Link to="/user">
        <p>Account Information</p>
      </Link>
      <Link to="/shop">
        <p>Items</p>
      </Link>
    </div>
  );
}

export default UserMenu;
