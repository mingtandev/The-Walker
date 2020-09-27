import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "./actions/authAction";
import "./navbar.scss";

function Navbar() {
  const user = useSelector((state) => state.auth);
  let dispatch = useDispatch();
  const logOut = () => {
    console.log("out");
    dispatch(signOut());
  };

  return (
    <nav className="nav">
      <Link to="/">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png"
          alt="Home"
        />
      </Link>
      <ul className="nav__links">
        <li className="nav__link">
          <Link to="/">Home</Link>
        </li>
        <li className="nav__link">
          <Link to="/blog">Blog and News</Link>
        </li>
        {user.user === null && (
          <li className="nav__link">
            <Link to="/sign-in">Sign In</Link>
          </li>
        )}
        {user.user === null && (
          <li className="nav__link">
            <Link to="/sign-up">Register</Link>
          </li>
        )}
        {user.user && <li>{user.user.username}</li>}
        {user.user && <li onClick={logOut}>Log Out</li>}
      </ul>
    </nav>
  );
}

export default Navbar;
