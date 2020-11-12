import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Link, useHistory } from "react-router-dom";
import { loadUser, signOut } from "../../actions/authAction";
import userApi from "../../api/userApi";
import "./index.scss";
import UserMenu from "../user/userMenu";

function Navbar() {
  const [navStyle, setNavStyle] = useState(false);
  let dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    async function getUserInfo() {
      try {
        if (!localStorage.getItem("token")) return;
        let res = await userApi.getUserInfo();
        console.log("res: ", res);
        dispatch(loadUser(res.user));
      } catch (error) {}
    }
    getUserInfo();
  }, []);

  let user = useSelector((state) => state.auth);

  const logOut = () => {
    console.log("out");
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
        <span className="nav__logo-text">r2w network</span>
      </Link>
      <div className="nav__links">
        <ul className="nav__links--pages">
          <li className="nav__link">
            <NavLink exact to="/" activeClassName="nav__link--selected">
              <i class="fas fa-home"></i> HOME
            </NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/blog" activeClassName="nav__link--selected">
              <i class="fab fa-blogger"></i> BLOGS
            </NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/shop" activeClassName="nav__link--selected">
              <i class="fas fa-cart-plus"></i> SHOP
            </NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/roll-up" activeClassName="nav__link--selected">
              <i class="fas fa-dharmachakra"></i> Roll Up
            </NavLink>
          </li>
          <li className="nav__link">
            <NavLink to="/giftcode" activeClassName="nav__link--selected">
              <i class="fas fa-award"></i> GIFTCODE
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="nav__links">
        <ul className="nav__links--auth">
          {!user.user && (
            <>
              <li className="nav__link">
                <NavLink to="/sign-in" activeClassName="nav__link--selected">
                  <i class="fas fa-sign-in-alt"></i> Sign In
                </NavLink>
              </li>
              <li className="nav__link">
                <NavLink to="/sign-up" activeClassName="nav__link--selected">
                  <i class="fas fa-user-plus"></i> Register
                </NavLink>
              </li>
            </>
          )}
          {user.user && (
            <>
              <div class="nav__userIcon">
                {
                  <li className="nav__link nav__link--user">
                    {user.user.name}
                  </li>
                }
                <UserMenu />
              </div>
              <li className="nav__link nav__link--logout" onClick={logOut}>
                Log Out <i class="fas fa-sign-out-alt"></i>
              </li>
            </>
          )}
        </ul>
      </div>
      {user.user && (
        <div className="nav__sub">
          <p>
            Cash: <span className="nav__subCash">{user.user.cash}</span>
          </p>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
