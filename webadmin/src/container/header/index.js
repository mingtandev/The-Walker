import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import jwt_decode from "jwt-decode";
import userApi from "../../api/userApi";
import * as authActions from "../../actions/authAction";
import "./index.scss";

function Header(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    async function getUserInfo() {
      try {
        if (!localStorage.getItem("token")) return;
        const id = jwt_decode(localStorage.getItem("token"))._id;
        console.log("id: ", id);
        let res = await userApi.getUserInfo(id);
        console.log(res);
        if (res && res.msg === "success") {
          dispatch(authActions.loadUser(res.user));
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUserInfo();
  }, []);
  const [submenuShow, setSubmenuShow] = useState(false);

  const { onToggleSidebar } = props;

  const toggleSidebar = () => {
    if (onToggleSidebar) onToggleSidebar();
  };

  const handleSubmenuShow = () => {
    setSubmenuShow((prevState) => !prevState);
  };

  const handleLogOut = () => {
    dispatch(authActions.signOut());
    history.push("/login");
  };

  return (
    <div className="header">
      <div className="header__left">
        <IconButton className="header__button" onClick={toggleSidebar}>
          <MenuIcon fontSize="large" />
        </IconButton>
        <Link className="header__logo" to="/">
          <img
            className="logo"
            src="https://r2wteam.files.wordpress.com/2020/04/cropped-cropped-cropped-cropped-3-1-2-1-2.png"
            alt="logo"
          />
          <span className="header__title">The Walker</span>
        </Link>
      </div>

      <div className="header__right">
        <span className="header__user-name">
          {user.user ? user.user.name : "Admin"}
        </span>
        <span className="submenu__link" onClick={handleLogOut}>
          Log Out
        </span>
        {/* <div className="header__avatar">
          <img src="" alt="avatar" onClick={handleSubmenuShow} />
          <div
            className={
              submenuShow ? "header__submenu" : "header__submenu--hide"
            }
          >
            <span className="submenu__link" onClick={handleLogOut}>
              Log Out
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Header;
