import React from "react";
import "./index.scss";

function UserItemDetail(props) {
  const { name, thumbnail, price, detail } = props;

  return (
    <div className="useritem">
      <img
        className="useritem__img"
        src={"http://" + thumbnail}
        alt="my-item"
      />
      <p className="useritem__name">{name}</p>
      <p className="useritem__detail">{detail}</p>
      <p className="useritem__price">
        Price: <span style={{ color: "red" }}>{price}</span>
      </p>
    </div>
  );
}

export default UserItemDetail;
