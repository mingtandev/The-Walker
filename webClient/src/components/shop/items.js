import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./shop.scss";
import itemApi from "../../api/itemApi";
import {
  itemsLoading,
  itemsLoaded,
  itemsFailLoaded,
} from "../../actions/itemsAction";
import Loading from "../loading/loading";

function Items() {
  const [items, setItems] = useState([]);
  let itemStatus = useSelector((state) => state.items.status);
  let dispatch = useDispatch();

  useEffect(() => {
    async function getItems() {
      try {
        let res = await itemApi.getAll();
        console.log("items: ", res);
        if (res.msg === "success") {
          setItems(res.products);
          dispatch(itemsLoaded());
        }
      } catch (error) {
        console.log(error);
        dispatch(itemsFailLoaded());
      }
    }
    getItems();
  }, [itemStatus, dispatch]);

  let user = useSelector((state) => state.auth);

  const handleDeleteItem = async (id) => {
    try {
      console.log(id);
      let res = await itemApi.delete(id);
      console.log(res);
      // if (res.msg === "success") dispatch(itemsLoading());
    } catch (error) {
      console.log(error);
    }
  };

  let content;
  if (itemStatus === "loading") {
    content = <Loading />;
    console.log("idle");
  } else if (itemStatus === "success") {
    console.log("idle");
    if (items.length) {
      content = items.map((item) => (
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
      ));
    } else {
      content = <h1>NO ITEMS TO SHOW</h1>;
    }
  } else if (itemStatus === "fail") {
    console.log("fail");
    content = <div>FAIL TO FETCH SHOP ITEMS</div>;
  } else if (itemStatus === "idle") {
    dispatch(itemsLoading());
    console.log("idle");
    content = <div>idle</div>;
  }

  return (
    <div className="items__container">
      {/* {items &&
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
        ))} */}
      {content}
    </div>
  );
}

export default Items;
