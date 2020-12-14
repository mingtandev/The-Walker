import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Link, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { loadUser, signOut } from "../../actions/authAction";
import userApi from "../../api/userApi";
import UserMenu from "../../components/user/userMenu";
import "./index.scss";

function Navbar() {
  let user = useSelector((state) => state.auth);

  let dispatch = useDispatch();
  let history = useHistory();
  const userDropdownRef = React.createRef();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    async function getUserInfo() {
      try {
        if (!localStorage.getItem("token")) return;
        const userID = jwt_decode(localStorage.getItem("token"))._id;
        let res = await userApi.getUserInfo(userID);
        console.log("res: ", res);
        dispatch(loadUser(res.user));
      } catch (error) {
        console.log(error);
      }
    }
    getUserInfo();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownRef]);

  const handleUserDropdownShow = () => {
    setUserDropdownOpen((prevState) => !prevState);
  };

  const logOut = () => {
    dispatch(signOut());
    history.push("/");
    return;
  };

  return (
    <nav className="nav">
      <Link to="/">
        <img
          className="nav__logo"
          src="https://r2wteam.files.wordpress.com/2020/04/cropped-cropped-cropped-cropped-3-1-2-1-2.png"
          alt="Home"
        />
        <span className="nav__logo-text">r2w fly team</span>
      </Link>
      <div className="nav__links">
        <ul className="nav__links--pages">
          <li className="nav__link">
            <NavLink exact to="/" replace activeClassName="nav__link--selected">
              <i className="fas fa-home"></i> HOME
            </NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/shop" replace activeClassName="nav__link--selected">
              <i className="fas fa-cart-plus"></i> SHOP
            </NavLink>
          </li>
          <li className="nav__link">
            <NavLink
              to="/roll-up"
              replace
              activeClassName="nav__link--selected"
            >
              <i className="fas fa-dharmachakra"></i> Roll Up
            </NavLink>
          </li>
          <li className="nav__link">
            <NavLink
              to="/giftcode"
              replace
              activeClassName="nav__link--selected"
            >
              <i className="fas fa-award"></i> GIFTCODE
            </NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/blog" replace activeClassName="nav__link--selected">
              <i className="fab fa-blogger"></i> BLOGS
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="nav__links">
        <ul className="nav__links--auth">
          {!user.user && (
            <>
              <li className="nav__link nav__link--capitalize">
                <NavLink
                  to="/sign-in"
                  replace
                  activeClassName="nav__link--selected"
                >
                  <i className="fas fa-sign-in-alt"></i> Sign In
                </NavLink>
              </li>
              <li className="nav__link nav__link--capitalize">
                <NavLink
                  to="/sign-up"
                  replace
                  activeClassName="nav__link--selected"
                >
                  <i className="fas fa-user-plus"></i> Register
                </NavLink>
              </li>
            </>
          )}
          {user.user && (
            <>
              <div class="nav__user" ref={userDropdownRef}>
                {
                  <li
                    className="nav__link nav__link--user"
                    onClick={handleUserDropdownShow}
                  >
                    {user.user.name}
                  </li>
                }
                {userDropdownOpen && <UserMenu />}
                <li className="nav__link nav__link--logout" onClick={logOut}>
                  Log Out <i className="fas fa-sign-out-alt"></i>
                </li>
              </div>
            </>
          )}
        </ul>
      </div>
      {user.user && (
        <div className="nav__sub">
          Cash: <span className="nav__subCash">{user.user.cash}</span>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
