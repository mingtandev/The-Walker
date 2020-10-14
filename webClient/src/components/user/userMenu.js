import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function UserMenu() {
  let user = useSelector((state) => state.auth);

  return (
    <div className="userMenu">
      <Link to="/user">
        <p>Account Information</p>
      </Link>
      {user.user && user.user.roles === "admin" && (
        <Link to="/blog/create">
          <p>Blog Create</p>
        </Link>
      )}
      <Link to="/shop">
        <p>Items</p>
      </Link>
    </div>
  );
}

export default UserMenu;
