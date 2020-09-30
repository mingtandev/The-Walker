import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "../actions/authAction";
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
              <li class="nav__link nav__user">{user.user.username}</li>
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
