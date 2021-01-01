import React from "react";
import UserItemHover from "../item/itemHover";
import "./index.scss";

function UserItemDetail(props) {
  const { name, thumbnail, boughtAt, details, description } = props;

  return (
    <div className="useritem">
      <img className="useritem__img" src={thumbnail} alt="my-item" />
      <p className="useritem__name">{name}</p>
      <p>Bought At: {new Date(boughtAt).toLocaleDateString()}</p>
      <UserItemHover data={props} />
    </div>
  );
}

export default UserItemDetail;
