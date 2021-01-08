import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../actions/authAction";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import StoreIcon from "@material-ui/icons/Store";
import HistoryIcon from "@material-ui/icons/History";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

function UserMenu() {
  let dispatch = useDispatch();

  const logOut = () => {
    dispatch(signOut());
    return;
  };

  return (
    <div className="userMenu">
      <Link className="userMenu__item" to="/my-profile">
        <div>
          <AccountBoxIcon />
          <span>Account Information</span>
        </div>
      </Link>
      <Link className="userMenu__item" to="/my-items">
        <div>
          <StoreIcon />
          <span>My Items</span>
        </div>
      </Link>
      <Link className="userMenu__item" to="/my-activities">
        <div>
          <HistoryIcon />
          <span>My Activities</span>
        </div>
      </Link>
      <Link className="userMenu__item userMenu__item-logout">
        <div onClick={logOut}>
          <ExitToAppIcon />
          <span>Log Out</span>
        </div>
      </Link>
    </div>
  );
}

export default UserMenu;
