import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import "./index.scss";
import { Link } from "react-router-dom";

function Header(props) {
  const [buttonShow, setButtonShow] = useState(true);
  const [submenuShow, setSubmenuShow] = useState(false);

  const { onToggleSidebar } = props;

  const toggleSidebar = () => {
    if (onToggleSidebar) onToggleSidebar();
    setButtonShow((prevState) => !prevState);
  };

  const handleSubmenuShow = () => {
    setSubmenuShow((prevState) => !prevState);
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
        <div className="header__avatar">
          <img src="" alt="avatar" onClick={handleSubmenuShow} />
          <div
            className={
              submenuShow ? "header__submenu" : "header__submenu--hide"
            }
          >
            <span className="submenu__link">Log Out</span>
          </div>
        </div>

        <span className="header__user-name">ADMIN</span>
      </div>
    </div>
  );
}

export default Header;
