import React from "react";
import { useSelector } from "react-redux";
import UserUpdate from "./userUpdate";
import "../../components/user/user.scss";

function UserInfo() {
  const user = useSelector((state) => state.auth);

  return (
    user.user && (
      <div className="user__container">
        <div className="user__infos">
          <div className="user__info">
            <span className="user__info-title">Username</span>
            <span className="user__info-content">{user.user.name}</span>
          </div>
          <div className="user__info">
            <span className="user__info-title">Email</span>
            <span className="user__info-content">{user.user.email}</span>
          </div>

          <div className="user__info">
            <span className="user__info-title">Cash</span>
            <span className="user__info-content">{user.user.cash}</span>
          </div>
          <div className="user__info">
            <span className="user__info-title">Account Status</span>
            <span className="user__info-content">Activated</span>
          </div>
        </div>
        <div className="user__update">
          <UserUpdate />
        </div>
      </div>
    )
  );
}

export default UserInfo;
