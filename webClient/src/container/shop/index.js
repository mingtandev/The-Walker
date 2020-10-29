import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import itemApi from "../../api/itemApi";
import {
  itemsLoading,
  itemsLoaded,
  itemsFailLoaded,
} from "../../actions/itemsAction";
import Loading from "../../components/loading";
import Item from "../../components/item";

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
  }, [itemStatus, dispatch]);

  // const handleDeleteItem = async (id) => {
  //   try {
  //     console.log(id);
  //     let res = await itemApi.delete(id);
  //     console.log(res);
  //     // if (res.msg === "success") dispatch(itemsLoading());
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  if (itemStatus === "idle") {
    dispatch(itemsLoading());
  }

  return (
    <>
      {itemStatus === "loading" && <Loading />}
      {itemStatus === "fail" && <div>FAIL TO FETCH SHOP ITEMS</div>}
      <div className="items__container">
        {itemStatus === "success" && items.length ? (
          items.map((item, id) => <Item key={id} {...item} />)
        ) : (
          <div>NO ITEMS</div>
        )}
      </div>
    </>
  );
}

export default Shop;
