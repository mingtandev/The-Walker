import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import itemApi from "../../api/itemApi";
import "./shop.scss";

function Items() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    async function getItems() {
      try {
        let res = await itemApi.getAll();
        console.log("items: ", res);
        setItems(res.products);
      } catch (error) {
        console.log(error);
      }
    }
    getItems();
  }, []);

  let user = useSelector((state) => state.auth);

  const handleDeleteItem = (id) => {
    console.log(id);
  };

  return (
    <div className="items__container">
      {items &&
        items.map((item) => (
          <div key={item._id} className="item">
            <img className="item__img" src={item.thumbnail} alt="item" />
            <p className="item__name">Name: {item.name}</p>
            <p className="item__type">Type: {item.type}</p>
            <p className="item__price">Price: {item.price}</p>
            <button className="item__add" type="button">
              Add to Cart
            </button>
            {user.user && user.user.roles === "admin" && (
              <button
                className="item__delete"
                type="button"
                onClick={() => handleDeleteItem(item._id)}
              >
                <i class="fas fa-trash"></i>
              </button>
            )}
          </div>
        ))}
    </div>
  );
}

export default Items;
