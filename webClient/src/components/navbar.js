import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { signOut } from "../actions/authAction";
import "./navbar.scss";
// import userApi from "../api/userApi";
// import jwt_decode from "jwt-decode";

function Navbar() {
  const user = useSelector((state) => state.auth);
  let dispatch = useDispatch();
  const logOut = () => {
    console.log("out");
    dispatch(signOut());
    return <Redirect to="/" />;
  };

  return (
    <nav className="nav">
      <Link to="/">
        <img
          className="nav__logo"
          src={require("../img/logo.png")}
          alt="Home"
        />
      </Link>
      <div className="nav__links">
        <ul className="nav__links--pages">
          <li className="nav__link">
            <Link to="/">
              <i class="fas fa-home"></i> Home
            </Link>
          </li>
          <li className="nav__link">
            <Link to="/blog">
              <i class="fab fa-blogger"></i> Blog and News
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav__links">
        <ul className="nav__links--auth">
          {!localStorage.getItem("token") && (
            <>
              <li className="nav__link">
                <Link to="/sign-in">
                  <i class="fas fa-sign-in-alt"></i> Sign In
                </Link>
              </li>
              <li className="nav__link">
                <Link to="/sign-up">
                  <i class="fas fa-user-plus"></i> Register
                </Link>
              </li>
            </>
          )}
          {localStorage.getItem("token") && (
            <>
              {user.user && (
                <li className="nav__link nav__link--user">{user.user.name}</li>
              )}
              <li className="nav__link nav__link--logout" onClick={logOut}>
                Log Out <i class="fas fa-sign-out-alt"></i>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* <ul className="nav__links">
        <li className="nav__link">
          <Link to="/">
            <i class="fas fa-home"></i> Home
          </Link>
        </li>
        <li className="nav__link">
          <Link to="/blog">
            <i class="fab fa-blogger"></i> Blog and News
          </Link>
        </li>
        {user.user === null && (
          <>
            <li className="nav__link">
              <Link to="/sign-in">
                <i class="fas fa-sign-in-alt"></i> Sign In
              </Link>
            </li>
            <li className="nav__link">
              <Link to="/sign-up">
                <i class="fas fa-user-plus"></i> Register
              </Link>
            </li>
          </>
        )}
        {user.user && (
          <>
            <li>{user.user.username}</li>
            <li className="nav__link--logout" onClick={logOut}>
              Log Out <i class="fas fa-sign-out-alt"></i>
            </li>
          </>
        )}
      </ul> */}
    </nav>
  );
}

export default Navbar;
