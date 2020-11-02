import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toastr } from "react-redux-toastr";
import "./index.scss";
import itemApi from "../../api/itemApi";
import {
  itemsLoading,
  itemsLoaded,
  itemsFailLoaded,
} from "../../actions/itemsAction";
import Loading from "../../components/loading";
import Item from "../../components/item";
import userApi from "../../api/userApi";
import { loadUser } from "../../actions/authAction";

function Shop() {
  const [items, setItems] = useState([]);
  const itemStatus = useSelector((state) => state.items.status);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getItems() {
      try {
        let res = await itemApi.getAll();
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
  }, [itemStatus]);

  const handleBuyItem = async (id) => {
    try {
      console.log(id);
      itemApi.buyOne(id).then((res) => {
        console.log("buy: ", res);
        if (res && res.msg === "success") {
          toastr.success("Buy Item Successfully", "Check Your Items Now");
          userApi
            .getUserInfo()
            .then((res) => {
              if (res.msg === "success") dispatch(loadUser(res.user));
            })
            .catch((error) => console.log(error));
        } else if (res && res.msg === "Cash not enough!")
          toastr.error("NOT ENOUGH CASH !", "Buy Item Fail");
        else toastr.warning("Cannot Afford Item", "Please Try Again");
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (itemStatus === "idle") {
    dispatch(itemsLoading());
  }

  return (
    <>
      {itemStatus === "loading" && <Loading />}
      {itemStatus === "fail" && <div>FAIL TO FETCH SHOP ITEMS</div>}
      <div className="items__container">
        {itemStatus === "success" && items.length ? (
          items.map((item, id) => (
            <Item
              onPurchase={() => handleBuyItem(item._id)}
              key={id}
              {...item}
            />
          ))
        ) : (
          <div>NO ITEMS</div>
        )}
      </div>
    </>
  );
}

export default Shop;
