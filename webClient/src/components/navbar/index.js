import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { loadUser, signOut } from "../../actions/authAction";
import userApi from "../../api/userApi";
import "./index.scss";
import UserMenu from "../user/userMenu";

function Navbar() {
  const [navStyle, setNavStyle] = useState(false);
  let dispatch = useDispatch();
  let history = useHistory();

  const changeNavStyle = () => {
    if (window.scrollY >= 50) {
      setNavStyle(true);
    } else setNavStyle(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavStyle);
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
    <nav className={navStyle ? "nav--change" : "nav"}>
      <Link to="/">
        <img
          className="nav__logo"
          src="https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.0-9/94262218_112321463790130_9162205595116240896_n.png?_nc_cat=111&ccb=2&_nc_sid=85a577&_nc_ohc=3HB_0Liu-vgAX8s4J5v&_nc_ht=scontent.fsgn5-5.fna&oh=0c027dcef0f6f6b269d7fec73f079967&oe=5FBC84B2"
          alt="Home"
        />
      </Link>
      <div className="nav__links">
        <ul className="nav__links--pages">
          <li className="nav__link">
            <Link to="/">
              <i class="fas fa-home"></i> HOME
            </Link>
          </li>
          <li className="nav__link">
            <Link to="/blog">
              <i class="fab fa-blogger"></i> BLOGS
            </Link>
          </li>
          <li className="nav__link">
            <Link to="/shop">
              <i class="fas fa-cart-plus"></i> SHOP
            </Link>
          </li>
          <li className="nav__link">
            <Link to="/roll-up">
              <i class="fas fa-dharmachakra"></i> Roll Up
            </Link>
          </li>
          <li className="nav__link">
            <Link to="/giftcode">
              <i class="fas fa-award"></i> GIFTCODE
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav__links">
        <ul className="nav__links--auth">
          {!user.user && (
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
