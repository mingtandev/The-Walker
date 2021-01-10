import React from "react";
import { useSelector } from "react-redux";
import UserUpdate from "./userUpdate";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import EmailIcon from "@material-ui/icons/Email";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import "./index.scss";

function UserInfo() {
  const user = useSelector((state) => state.auth);

  return (
    user.user && (
      <div className="user__container">
        <div className="user__infos">
          <div className="user__info">
            <div className="user__info--left">
              <AssignmentIndIcon className="user__info-icon" />
            </div>
            <div className="user__info--right">
              <span className="user__info-title">Username</span>
              <span className="user__info-content">{user.user.name}</span>
            </div>
          </div>
          <div className="user__info">
            <div className="user__info--left">
              <EmailIcon className="user__info-icon" />
            </div>
            <div className="user__info--right">
              <span className="user__info-title">Email</span>
              <span className="user__info-content">{user.user.email}</span>
            </div>
          </div>
          <div className="user__info">
            <div className="user__info--left">
              <MonetizationOnIcon className="user__info-icon" />
            </div>
            <div className="user__info--right">
              <span className="user__info-title">Cash</span>
              <span className="user__info-content">{user.user.cash}</span>
            </div>
          </div>
          <div className="user__info">
            <div className="user__info--left">
              <CheckBoxIcon className="user__info-icon" />
            </div>
            <div className="user__info--right">
              <span className="user__info-title">Account Status</span>
              <span className="user__info-content">Activated</span>
            </div>
          </div>
        </div>
        <div>
          <UserUpdate />
        </div>
      </div>
    )
  );
}

export default UserInfo;
