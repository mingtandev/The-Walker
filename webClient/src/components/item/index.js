import React from "react";
import "./index.scss";

function ItemDetail(props) {
  const { _id, name, thumbnail, price, onPurchase } = props;

  const handleBuyItem = () => {
    if (onPurchase) onPurchase(_id);
  };

  return (
    <div className="item">
      <img className="item__img" src={"http://" + thumbnail} alt="item" />
      <p className="item__name">{name}</p>
      <p className="item__price">
        Price: <span style={{ color: "red" }}>{price}</span>
      </p>
      <button className="item__add" type="button" onClick={handleBuyItem}>
        Buy
      </button>
    </div>
  );
}

export default ItemDetail;
