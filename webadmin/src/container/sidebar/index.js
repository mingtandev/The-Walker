import React from "react";
import { Link, NavLink } from "react-router-dom";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import StoreIcon from "@material-ui/icons/Store";
import "./index.scss";

function Sidebar(props) {
  const { show } = props;

  return (
    <div className={`${"sidebar"}${show ? "" : " sidebar--hide"}`}>
      <ul className="sidebar__nav">
        <li className="sidebar__nav-link">
          <NavLink activeClassName="sidebar__nav-link--active" to="/dashboard">
            <DashboardIcon className="sidebar__nav-icon" fontSize="large" />
            Dashboard
          </NavLink>
        </li>
        <li className="sidebar__nav-link">
          <NavLink activeClassName="sidebar__nav-link--active" to="/users">
            <PeopleAltIcon className="sidebar__nav-icon" fontSize="large" />
            Users
          </NavLink>
        </li>
        <li className="sidebar__nav-link">
          <NavLink activeClassName="sidebar__nav-link--active" to="/items">
            <StoreIcon className="sidebar__nav-icon" fontSize="large" />
            Items
          </NavLink>
        </li>
        <li className="sidebar__nav-link">
          <NavLink activeClassName="sidebar__nav-link--active" to="/giftcode">
            <StoreIcon className="sidebar__nav-icon" fontSize="large" />
            GiftCode
          </NavLink>
        </li>
        <li className="sidebar__nav-link">
          <NavLink activeClassName="sidebar__nav-link--active" to="/rollup">
            <StoreIcon className="sidebar__nav-icon" fontSize="large" />
            Roll Up
          </NavLink>
        </li>
        <li className="sidebar__nav-link">
          <NavLink activeClassName="sidebar__nav-link--active" to="/blogs">
            <LibraryBooksIcon className="sidebar__nav-icon" fontSize="large" />
            Blogs
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
