import React from "react";
import UserItemHover from "../item/itemHover";
import "./index.scss";

function UserItemDetail(props) {
  const { name, thumbnail, details, description } = props;

  return (
    <div className="useritem">
      <img className="useritem__img" src={thumbnail} alt="my-item" />
      <p className="useritem__name">{name}</p>
      <UserItemHover data={props} />
    </div>
  );
}

export default UserItemDetail;
