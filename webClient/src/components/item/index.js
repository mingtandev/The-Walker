import React from "react";
import ItemHover from "./itemHover";
import "./index.scss";

function ItemDetail(props) {
  const { _id, name, thumbnail, price, type, onPurchase } = props;

  const handleBuyItem = () => {
    if (onPurchase) onPurchase(_id);
  };

  return (
    <div className="item">
      <img className="item__img" src={thumbnail} alt="item" />
      <p className="item__name">{name}</p>
      <p className="item__price">
        Price: <span style={{ color: "red", fontWeight: "bold" }}>{price}</span>
      </p>
      <button className="item__buy" type="button" onClick={handleBuyItem}>
        Buy
      </button>
      <ItemHover data={props} />
    </div>
  );
}

export default ItemDetail;
