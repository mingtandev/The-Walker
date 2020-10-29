import React from "react";
import "./index.scss";

function Item(props) {
  const { _id, name, type, thumbnail, price } = props;
  return (
    <div className="item">
      <img className="item__img" src={thumbnail} alt="item" />
      <p className="item__name">Name: {name}</p>
      <p className="item__type">Type: {type}</p>
      <p className="item__price">Price: {price}</p>
      <button className="item__add" type="button">
        Add to Cart
      </button>
      {/* {user.user && user.user.roles === "admin" && (
        <button
          className="item__delete"
          type="button"
          //   onClick={() => handleDeleteItem(item._id)}
        >
          <i class="fas fa-trash"></i>
        </button>
      )} */}
    </div>
  );
}

export default Item;
